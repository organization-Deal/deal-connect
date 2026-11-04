export const onRequestGet = async ({env}:any) => Response.json({
  ok:true, service:'deal-connect-api', version:'0.2.0', mode:'preview',
  databaseConfigured:Boolean(env?.DB), lineConfigured:Boolean(env?.LINE_CHANNEL_ID&&env?.LINE_CHANNEL_SECRET),
  timestamp:new Date().toISOString()
});
