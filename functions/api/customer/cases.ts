export const onRequestGet = async ({env,data}:any) => {
 const id=data?.session?.customer_id;if(!id)return Response.json({ok:false,error:'ACCOUNT_NOT_LINKED'},{status:403});
 const rows=await env.DB.prepare('SELECT case_id,title,category,status,priority,assigned_team,created_at,updated_at FROM cases WHERE customer_id=? ORDER BY created_at DESC LIMIT 50').bind(id).all();
 return Response.json({ok:true,cases:rows.results||[]});
};
export const onRequestPost = async ({request,env,data}:any) => {
 const customerId=data?.session?.customer_id;if(!customerId)return Response.json({ok:false,error:'ACCOUNT_NOT_LINKED'},{status:403});
 const body:any=await request.json().catch(()=>({}));const title=String(body.title||'').trim();const locId=String(body.locId||'');const category=String(body.category||'GENERAL');const description=String(body.description||'').trim();
 if(!title||!locId)return Response.json({ok:false,error:'TITLE_AND_LOCATION_REQUIRED'},{status:400});
 const allowed:any=await env.DB.prepare("SELECT holding_id FROM holdings WHERE customer_id=? AND loc_id=? AND status='ACTIVE' LIMIT 1").bind(customerId,locId).first();
 if(!allowed)return Response.json({ok:false,error:'NO_ACCESS_TO_LOCATION'},{status:403});
 const caseId=`PX-${crypto.randomUUID()}`;
 await env.DB.prepare('INSERT INTO cases(case_id,customer_id,loc_id,title,description,category,status,priority) VALUES(?,?,?,?,?,?,?,?)').bind(caseId,customerId,locId,title,description,category,'OPEN','NORMAL').run();
 await env.DB.prepare('INSERT INTO audit_logs(audit_id,actor_type,actor_id,action,entity_type,entity_id,detail_json) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),'CUSTOMER',customerId,'CREATE_CASE','CASE',caseId,JSON.stringify({locId,category})).run();
 return Response.json({ok:true,caseId,status:'OPEN'});
};
