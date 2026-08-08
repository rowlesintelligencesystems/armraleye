const DOCTRINE=["Seek God within","Unconditional love","Understanding","Harmonic balance","Higher frequency / resonance"];
const DOCTRINE_NOTE="The sequence is the architecture.";
const BRAND="ARMR ALEYE";
const VERSION="3.1-trend-ppi";

const PLATFORM_RULES=[
{id:"shopify",label:"Shopify",confidence:"H",urlRe:[/\.myshopify\.com/i,/cdn\.shopify\.com/i,/\/cdn\/shop\//i],bodyRe:[/Shopify\.shop/i,/myshopify/i],scan_options:["catalog","collections","public_url"],push_options:["shopify_draft","website_webhook","social_webhook"]},
{id:"etsy",label:"Etsy",confidence:"H",urlRe:[/etsy\.com/i],bodyRe:[/etsy\.com/i],scan_options:["public_url"],push_options:["website_webhook","social_webhook","csv_download"]},
{id:"gumroad",label:"Gumroad",confidence:"H",urlRe:[/gumroad\.com/i],bodyRe:[/gumroad/i],scan_options:["public_url"],push_options:["website_webhook","social_webhook","csv_download"]},
{id:"woocommerce",label:"WooCommerce",confidence:"M",urlRe:[/woocommerce/i],bodyRe:[/woocommerce/i,/wp-json\/wc\//i],scan_options:["public_url","catalog"],push_options:["website_webhook","social_webhook","csv_download"]},
{id:"squarespace",label:"Squarespace",confidence:"M",urlRe:[/squarespace\.com/i],bodyRe:[/squarespace/i],scan_options:["public_url"],push_options:["website_webhook","social_webhook","csv_download"]},
{id:"generic_website",label:"Website",confidence:"L",urlRe:[/^https?:\/\//i],bodyRe:[],scan_options:["public_url"],push_options:["website_webhook","social_webhook","csv_download"]},
];
const PLANS={PIE:{credits:25,price_monthly:149},HEAVY:{credits:40,price_monthly:249},STACK:{credits:50,price_monthly:399},MEMBERS:{credits:0,price_monthly:29}};
const CATALOG=[
{sku:"ARMR-DIG-DOC-001",title:"Doctrine Architecture Manual",price:67,type:"digital"},
{sku:"ARMR-DIG-DOC-002",title:"PIE Operator Manual",price:67,type:"digital"},
{sku:"ARMR-DIG-DOC-003",title:"Milestone Payment Gate Handbook",price:127,type:"digital"},
{sku:"ARMR-DIG-WVF-001",title:"Whoppertunity vs Flopportunity Ebook",price:27,type:"digital"},
{sku:"ARMR-SUB-PIE",title:"Product Intelligence Engine",price_monthly:149,type:"subscription"},
{sku:"ARMR-SUB-STACK",title:"Engine Stack",price_monthly:399,type:"subscription"},
{sku:"ARMR-SUB-MEMBERS",title:"Members Library",price_monthly:29,type:"subscription"},
];
const auditBuffer=[];

function json(data,status=200){return new Response(JSON.stringify(data,null,2),{status,headers:{"content-type":"application/json; charset=utf-8","access-control-allow-origin":"*","x-armr-brand":BRAND}});}
function cors(){return new Response(null,{headers:{"access-control-allow-origin":"*","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type,authorization,x-armr-scope"}});}
async function sha256Hex(text){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest("SHA-256",data);return[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function doctrineHash(){return sha256Hex(DOCTRINE.join("|"));}
function claimsBoundary(){return"Educational/operational only. No medical claims. No guaranteed income or rankings.";}
function clamp(n,lo,hi){return Math.max(lo,Math.min(hi,n));}
function n01(v,def=0.5){if(v==null||v==="")return def;const x=Number(v);if(Number.isNaN(x))return def;if(x>1&&x<=10)return clamp(x/10,0,1);return clamp(x,0,1);}

function detectPlatform({url="",platform_hint="",html_snippet=""}={}){
const u=String(url||"").trim(),hint=String(platform_hint||"").toLowerCase().trim(),html=String(html_snippet||"");
if(hint){const rule=PLATFORM_RULES.find(r=>r.id===hint)||PLATFORM_RULES.find(r=>r.label.toLowerCase()===hint);
if(rule)return{ok:true,source:"user_hint",detected:{id:rule.id,label:rule.label,confidence:"H"},scan_options:rule.scan_options,push_options:rule.push_options,next_prompt:"Would you like me to scan your website for product matching?"};}
for(const rule of PLATFORM_RULES){if(rule.id==="generic_website")continue;
if(rule.urlRe.some(re=>re.test(u))||rule.bodyRe.some(re=>re.test(html)))
return{ok:true,source:"url",detected:{id:rule.id,label:rule.label,confidence:rule.confidence},input_url:u||null,scan_options:rule.scan_options,push_options:rule.push_options,next_prompt:"Would you like me to scan your website for product matching?"};}
if(/^https?:\/\//i.test(u))return{ok:true,source:"url",detected:{id:"generic_website",label:"Website",confidence:"L"},input_url:u,scan_options:["public_url"],push_options:["website_webhook","social_webhook","csv_download"],next_prompt:"Would you like me to scan your website for product matching?"};
return{ok:true,source:"none",detected:null,prompt:"Where do you sell?",choices:[{id:"shopify",label:"Shopify"},{id:"website",label:"Website only"},{id:"etsy",label:"Etsy"},{id:"other",label:"Other / not sure"}]};
}

export default{async fetch(request,env){
const url=new URL(request.url);
let path=url.pathname.replace(/\/$/,"")||"/";
if(request.method==="OPTIONS")return cors();

if(path==="/api/memory/hard"||path==="/api/memory"||path==="/memory/hard"){
return json({
ok:true,brand:BRAND,version:VERSION,source:"SCARA_HARD_MEMORY",device:"phone_only",
forbid:["large_code_paste","laptop_cli_as_primary","avatar_spam_in_manuals"],
api:"https://api.armraleye.com",commerce:"https://www.armraleye.com",
worker_target:"3.1-trend-ppi",deploy_path:"git:worker-deploy/cf-phone-ship",
secrets:{WEBSITE_WEBHOOK_URL:"set_in_cf_or_not_configured",SOCIAL_WEBHOOK_URL:"set_in_cf_or_not_configured"},
rules:["Read Hard Memory before founder-facing deploy instructions","No select-all paste of large JS on phone","Prefer delete Worker + Create + Connect Git","Missing webhooks correctly return not_configured"],
time:new Date().toISOString()
});
}

if(path==="/"||path==="/api/health"){
const dh=await doctrineHash();
return json({ok:true,service:"armraleye",brand:BRAND,version:VERSION,engine:"Revenue Multiplication Engine",core:"PIE",
doctrine_note:DOCTRINE_NOTE,doctrine_hash:dh,
features:["detect","match","match_scorer","push","ppi","trend","cie","aiie","session","completeness","memory"],time:new Date().toISOString()});
}

if(path==="/api/doctrine"){
const dh=await doctrineHash();
return json({ok:true,brand:BRAND,sequence:DOCTRINE,note:DOCTRINE_NOTE,hash:dh});
}

if(path==="/api/catalog"){
return json({ok:true,brand:BRAND,doctrine:DOCTRINE,plans:PLANS,catalog:CATALOG,claims_boundary:claimsBoundary()});
}

if(path==="/api/systems"||path==="/api/completeness"){
return json({ok:true,brand:BRAND,version:VERSION,rme:"Revenue Multiplication Engine",
registry:["PIE","PPI","TREND","CIE","AIIE"],features:["detect","match","match_scorer","push","ppi","trend","cie","aiie","session","completeness","memory"]});
}

if(path==="/api/pie/match"&&request.method==="POST"){
let body={};try{body=await request.json();}catch{body={};}
if(!body.confirm_scan)return json({ok:false,error:"confirm_required",prompt:"Would you like me to scan your website for product matching?"});
const platform=detectPlatform({url:body.url,platform_hint:body.platform||body.platform_hint,html_snippet:body.html});
const inv=Array.isArray(body.inventory)?body.inventory:[{title:body.title||"Anchor product",type:body.type||"physical"}];
const proposals=inv.slice(0,5).map(a=>({
inventory_anchor:a.title||a.id||"item",
proposed_digital_title:`${a.title||"Product"} — Quick-Start & Operator Checklist`,
bundle_angle:"Free-with-purchase or checkout upsell",
claims_boundary:claimsBoundary(),
score:0.72,confidence:"M"
}));
return json({ok:true,brand:BRAND,engine:"Revenue Multiplication Engine",scorer:"v1",platform,credits_used:1,credits_limit:25,proposals,claims_boundary:claimsBoundary()});
}

if(path==="/api/push"&&request.method==="POST"){
let body={};try{body=await request.json();}catch{body={};}
if(!body.confirm_push)return json({ok:false,error:"confirm_required",prompt:"Push these assets to your connected channels?"});
const channels=Array.isArray(body.channels)?body.channels:["website_webhook","social_webhook"];
const results=[];
for(const ch of channels){
let hook=null;if(ch==="website_webhook")hook=env.WEBSITE_WEBHOOK_URL;if(ch==="social_webhook")hook=env.SOCIAL_WEBHOOK_URL;
if(ch==="shopify_draft"){results.push({channel:ch,ok:false,error:"not_configured"});continue;}
if(!hook){results.push({channel:ch,ok:false,error:"not_configured"});continue;}
try{const r=await fetch(hook,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({source:"ARMR_ALEYE",brand:BRAND,event:"push.assets",channel:ch,time:new Date().toISOString()})});results.push({channel:ch,ok:r.ok,status:r.status});}
catch(e){results.push({channel:ch,ok:false,error:String(e&&e.message||e)});}
}
return json({ok:true,brand:BRAND,results});
}

if(path==="/api/ppi/score"&&request.method==="POST"){
let body={};try{body=await request.json();}catch{body={};}
const startup=n01(body.startup),time=n01(body.time),monthly=n01(body.monthly),automation=n01(body.automation);
const passive=n01(body.passive),demand=n01(body.demand??body.demand_score??body.trend);
const competition=n01(body.competition),skill=n01(body.skill),scalability=n01(body.scalability),trend=n01(body.trend_score??body.trend??demand);
const competition_effective=body.competition_as_intensity?1-competition:competition;
const total=startup*0.10+time*0.15+monthly*0.15+automation*0.10+passive*0.10+demand*0.10+competition_effective*0.10+skill*0.10+scalability*0.05+trend*0.05;
const score=clamp(total,0,1);
let label="watch";
if(score>=0.75)label="whoopertunity";else if(score>=0.55)label="expansion";else if(score>=0.45)label="watch";else if(score>=0.35)label="pivot";else label="floppertunity";
return json({ok:true,brand:BRAND,engine:"PPI",score,label,claims_boundary:claimsBoundary()});
}

if(path==="/api/trend/blueprint")return json({ok:true,brand:BRAND,engine:"TREND",stages:["Signal Intake","Score","Label","Placement"]});
if(path==="/api/aiie/architecture")return json({ok:true,brand:BRAND,engine:"AIIE",layers:["governance","intelligence","content","packaging","distribution","monetization","access"]});

return json({error:"not_found",brand:BRAND},404);
}};
