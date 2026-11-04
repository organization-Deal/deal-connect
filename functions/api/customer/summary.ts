export const onRequestGet = async ({env,data}:any) => {
 const s=data?.session;if(!s?.customer_id)return Response.json({ok:false,error:'ACCOUNT_NOT_LINKED'},{status:403});
 const holdings=await env.DB.prepare("SELECT h.loc_id,l.location_name,h.percentage,l.business_type,l.status FROM holdings h JOIN locations l ON l.loc_id=h.loc_id WHERE h.customer_id=? AND h.status='ACTIVE'").bind(s.customer_id).all();
 const cases=await env.DB.prepare('SELECT case_id,title,category,status,priority,updated_at FROM cases WHERE customer_id=? ORDER BY updated_at DESC LIMIT 30').bind(s.customer_id).all();
 return Response.json({ok:true,customerId:s.customer_id,holdings:holdings.results||[],cases:cases.results||[]});
};
