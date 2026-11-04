export const onRequestPost = async ({request,env,data}:any) => {
 const staff=data?.session;if(!staff||staff.role!=='STAFF')return Response.json({ok:false,error:'FORBIDDEN'},{status:403});
 const body:any=await request.json().catch(()=>({}));const requestId=String(body.requestId||'');const decision=String(body.decision||'');const note=String(body.note||'');
 if(!requestId||!['APPROVE','NEEDS_REVIEW','REJECT'].includes(decision))return Response.json({ok:false,error:'INVALID_INPUT'},{status:400});
 const req:any=await env.DB.prepare('SELECT * FROM verification_requests WHERE request_id=?').bind(requestId).first();
 if(!req)return Response.json({ok:false,error:'NOT_FOUND'},{status:404});
 if(decision==='APPROVE'){
  if(!req.candidate_customer_id)return Response.json({ok:false,error:'NO_UNIQUE_CUSTOMER_CANDIDATE'},{status:409});
  const linked:any=await env.DB.prepare("SELECT account_id FROM customer_accounts WHERE provider='LINE' AND provider_user_id=? AND status='ACTIVE'").bind(req.provider_user_id).first();
  if(linked)return Response.json({ok:false,error:'LINE_ACCOUNT_ALREADY_LINKED'},{status:409});
  await env.DB.batch([
   env.DB.prepare('INSERT INTO customer_accounts(account_id,customer_id,provider,provider_user_id,status) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),req.candidate_customer_id,'LINE',req.provider_user_id,'ACTIVE'),
   env.DB.prepare("UPDATE verification_requests SET match_status='APPROVED',review_note=?,reviewed_by=?,reviewed_at=CURRENT_TIMESTAMP WHERE request_id=?").bind(note,staff.email||staff.provider_user_id,requestId),
   env.DB.prepare('UPDATE sessions SET customer_id=? WHERE provider=\'LINE\' AND provider_user_id=?').bind(req.candidate_customer_id,req.provider_user_id),
   env.DB.prepare('INSERT INTO audit_logs(audit_id,actor_type,actor_id,action,entity_type,entity_id,detail_json) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),'STAFF',staff.provider_user_id,'APPROVE_CUSTOMER_LINK','VERIFICATION_REQUEST',requestId,JSON.stringify({customerId:req.candidate_customer_id}))
  ]);
 }else{
  const status=decision==='REJECT'?'REJECTED':'NEEDS_REVIEW';
  await env.DB.batch([
   env.DB.prepare('UPDATE verification_requests SET match_status=?,review_note=?,reviewed_by=?,reviewed_at=CURRENT_TIMESTAMP WHERE request_id=?').bind(status,note,staff.email||staff.provider_user_id,requestId),
   env.DB.prepare('INSERT INTO audit_logs(audit_id,actor_type,actor_id,action,entity_type,entity_id,detail_json) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),'STAFF',staff.provider_user_id,decision,'VERIFICATION_REQUEST',requestId,JSON.stringify({note}))
  ]);
 }
 return Response.json({ok:true,requestId,decision});
};
