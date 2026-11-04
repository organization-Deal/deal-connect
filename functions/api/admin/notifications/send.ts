export const onRequestPost = async ({request,env,data}:any) => {
 const staff=data?.session;if(!staff||staff.role!=='STAFF')return Response.json({ok:false,error:'FORBIDDEN'},{status:403});
 if(!env.LINE_CHANNEL_ACCESS_TOKEN)return Response.json({ok:false,error:'LINE_MESSAGING_NOT_CONFIGURED'},{status:503});
 const body:any=await request.json().catch(()=>({}));const customerId=String(body.customerId||'');const text=String(body.text||'').trim();const summary=String(body.summary||text.slice(0,120));
 if(!customerId||!text||text.length>5000)return Response.json({ok:false,error:'INVALID_INPUT'},{status:400});
 const account:any=await env.DB.prepare("SELECT provider_user_id FROM customer_accounts WHERE customer_id=? AND provider='LINE' AND status='ACTIVE'").bind(customerId).first();
 if(!account)return Response.json({ok:false,error:'CUSTOMER_HAS_NO_LINKED_LINE_ACCOUNT'},{status:409});
 const response=await fetch('https://api.line.me/v2/bot/message/push',{method:'POST',headers:{Authorization:`Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({to:account.provider_user_id,messages:[{type:'text',text}]})});
 const providerMessageId=response.headers.get('x-line-request-id');const status=response.ok?'SENT':'FAILED';
 await env.DB.prepare('INSERT INTO notification_logs(notification_id,customer_id,channel,event_type,message_summary,delivery_status,provider_message_id,sent_at) VALUES(?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),customerId,'LINE','MANUAL_PUSH',summary,status,providerMessageId,response.ok?new Date().toISOString():null).run();
 if(!response.ok){const detail=await response.text();return Response.json({ok:false,error:'LINE_PUSH_FAILED',detail:detail.slice(0,500)},{status:502});}
 return Response.json({ok:true,status,providerMessageId});
};
