export const onRequestGet = async ({env}:any) => {
 const rows=await env.DB.prepare('SELECT request_id,submitted_name,submitted_email,submitted_phone,candidate_customer_id,match_status,review_note,created_at FROM verification_requests ORDER BY created_at DESC LIMIT 200').all();
 return Response.json({ok:true,requests:rows.results||[]});
};
