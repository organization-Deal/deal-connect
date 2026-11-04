const protectedPrefixes=['/api/customer/','/api/admin/','/api/connect/','/api/me'];
export const onRequest = async (context:any) => {
  const url=new URL(context.request.url);
  if(!protectedPrefixes.some(prefix=>url.pathname.startsWith(prefix))) return context.next();
  const cookie=context.request.headers.get('Cookie')||'';
  const match=cookie.match(/(?:^|;\s*)dc_session=([^;]+)/);
  if(!match||!context.env?.DB) return Response.json({ok:false,error:'UNAUTHENTICATED'},{status:401});
  const row=await context.env.DB.prepare('SELECT session_id,provider_user_id,display_name,email,role,customer_id,expires_at FROM sessions WHERE session_id=? AND expires_at>?').bind(decodeURIComponent(match[1]),new Date().toISOString()).first();
  if(!row) return Response.json({ok:false,error:'SESSION_EXPIRED'},{status:401});
  if(url.pathname.startsWith('/api/admin/')&&row.role!=='STAFF') return Response.json({ok:false,error:'FORBIDDEN'},{status:403});
  context.data.session=row;
  return context.next();
};
