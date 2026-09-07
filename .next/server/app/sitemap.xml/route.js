"use strict";(()=>{var e={};e.id=717,e.ids=[717],e.modules={11185:e=>{e.exports=require("mongoose")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8711:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>w,requestAsyncStorage:()=>h,routeModule:()=>d,serverHooks:()=>x,staticGenerationAsyncStorage:()=>y});var a={};r.r(a),r.d(a,{GET:()=>g,revalidate:()=>c});var i=r(49303),o=r(88716),l=r(60670),s=r(87070),p=r(37704),n=r(62270),u=r(79714);let c=3600;function m(e){return e?e.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"):""}async function g(){let e=process.env.NEXT_PUBLIC_SITE_URL||"https://homes.alyora.in",t=[],r=[];try{[t,r]=await Promise.all([(0,p.Mw)().catch(()=>[]),(0,p.kQ)().catch(()=>[])])}catch(e){console.error("Error fetching sitemap data:",e)}let a=new Date().toISOString(),i=`<?xml version="1.0" encoding="UTF-8"?>
`;return i+=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`,[{url:`${e}`,priority:"1.0",changefreq:"daily"},{url:`${e}/properties`,priority:"0.9",changefreq:"daily"}].forEach(e=>{i+=`  <url>
    <loc>${m(e.url)}</loc>
    <lastmod>${a}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>
`}),(t||[]).forEach(t=>{let r=(t._id||t.id||"").toString(),o=(0,u.E)(t.name||"property",t.location||"kerala",r),l=`${e}/properties/${o}`,s=t.updatedAt?new Date(t.updatedAt).toISOString():a;i+=`  <url>
    <loc>${m(l)}</loc>
    <lastmod>${s}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;let p=[],c=t.image?.secure_url||t.image_url;c&&"string"==typeof c&&c.startsWith("http")&&p.push({url:c,title:(0,n.cG)(t,void 0,0)}),Array.isArray(t.media)&&t.media.forEach((e,r)=>{let a=e.secure_url||e.url;a&&"string"==typeof a&&a.startsWith("http")&&!p.some(e=>e.url===a)&&p.push({url:a,title:(0,n.cG)(t,e.caption,r+1)})}),p.forEach(e=>{i+=`    <image:image>
      <image:loc>${m(e.url)}</image:loc>
      <image:title>${m(e.title)}</image:title>
    </image:image>
`}),i+=`  </url>
`}),i+="</urlset>",new s.NextResponse(i,{status:200,headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400","Access-Control-Allow-Origin":"*"}})}let d=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"route",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"C:\\Users\\admin\\Downloads\\alyora_deign\\alyora-main\\src\\app\\sitemap.xml\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:h,staticGenerationAsyncStorage:y,serverHooks:x}=d,f="/sitemap.xml/route";function w(){return(0,l.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:y})}}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948,22,972,493],()=>r(8711));module.exports=a})();