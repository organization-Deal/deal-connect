export const onRequestPost = async ({request,env,data}:any) => {
 const session=data?.session;if(!session?.customer_id)return Response.json({ok:false,error:'ACCOUNT_NOT_LINKED'},{status:403});
 const body:any=await request.json().catch(()=>({}));const voteId=String(body.voteId||'');const choice=String(body.choice||'');
 if(!voteId||!['YES','NO','ABSTAIN'].includes(choice))return Response.json({ok:false,error:'INVALID_INPUT'},{status:400});
 const vote:any=await env.DB.prepare("SELECT vote_id,status,closes_at FROM votes WHERE vote_id=?").bind(voteId).first();
 if(!vote||vote.status!=='OPEN')return Response.json({ok:false,error:'VOTE_NOT_OPEN'},{status:409});
 if(vote.closes_at&&new Date(vote.closes_at).getTime()<Date.now())return Response.json({ok:false,error:'VOTE_CLOSED'},{status:409});
 const eligible:any=await env.DB.prepare('SELECT weight FROM vote_eligibility WHERE vote_id=? AND customer_id=?').bind(voteId,session.customer_id).first();
 if(!eligible)return Response.json({ok:false,error:'NOT_ELIGIBLE'},{status:403});
 try{
  await env.DB.prepare('INSERT INTO vote_ballots(vote_id,customer_id,choice) VALUES(?,?,?)').bind(voteId,session.customer_id,choice).run();
 }catch{return Response.json({ok:false,error:'ALREADY_VOTED'},{status:409});}
 await env.DB.prepare('INSERT INTO audit_logs(audit_id,actor_type,actor_id,action,entity_type,entity_id,detail_json) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),'CUSTOMER',session.customer_id,'CAST_VOTE','VOTE',voteId,JSON.stringify({choice,weight:eligible.weight})).run();
 return Response.json({ok:true,recorded:true});
};
