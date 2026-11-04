const toBase64=(bytes:ArrayBuffer)=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
export const onRequestPost = async ({request,env}:any) => {
 if(!env.LINE_CHANNEL_SECRET)return new Response('Webhook is not configured',{status:503});
 const raw=await request.text();const signature=request.headers.get('x-line-signature')||'';
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.LINE_CHANNEL_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const digest=toBase64(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(raw)));
 if(digest!==signature)return new Response('Invalid signature',{status:401});
 // Events are acknowledged here. Business actions and outbound messages require explicit opt-in rules.
 return Response.json({ok:true,received:true});
};
