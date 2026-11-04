export const onRequestPost = async ({request,env,data}:any) => {
 const session=data?.session;if(!session||session.role!=='CUSTOMER')return Response.json({ok:false,error:'UNAUTHENTICATED'},{status:401});
 const body:any=await request.json().catch(()=>({}));const name=String(body.name||'').trim();const email=String(body.email||'').trim().toLowerCase();const phone=String(body.phone||'').replace(/\s/g,'');
 if(!name||(!email&&!phone))return Response.json({ok:false,error:'NAME_AND_CONTACT_REQUIRED'},{status:400});
 // Matching only creates a candidate. It never links or grants access automatically.
 let candidate:any=null;
 if(email){const matches=await env.DB.prepare('SELECT customer_id FROM customers WHERE lower(email_normalized)=? AND status=\'ACTIVE\' LIMIT 2').bind(email).all();if(matches.results?.length===1)candidate=matches.results[0].customer_id;}
 const id=crypto.randomUUID();
 await env.DB.prepare('INSERT INTO verification_requests(request_id,provider,provider_user_id,submitted_name,submitted_email,submitted_phone,candidate_customer_id,match_status) VALUES(?,?,?,?,?,?,?,?)').bind(id,'LINE',session.provider_user_id,name,email||null,phone||null,candidate,'PENDING').run();
 await env.DB.prepare('INSERT INTO audit_logs(audit_id,actor_type,actor_id,action,entity_type,entity_id,detail_json) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),'CUSTOMER',session.provider_user_id,'CREATE_CONNECT_REQUEST','VERIFICATION_REQUEST',id,JSON.stringify({candidateFound:Boolean(candidate)})).run();
 return Response.json({ok:true,requestId:id,status:'PENDING',candidateFound:Boolean(candidate)});
};
