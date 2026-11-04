export const onRequestGet = async ({data}:any) => Response.json({ok:true,user:data?.session||null});
