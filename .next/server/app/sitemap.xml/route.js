"use strict";(()=>{var e={};e.id=717,e.ids=[717],e.modules={11185:e=>{e.exports=require("mongoose")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8711:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>x,patchFetch:()=>$,requestAsyncStorage:()=>h,routeModule:()=>g,serverHooks:()=>f,staticGenerationAsyncStorage:()=>y});var a={};t.r(a),t.d(a,{GET:()=>d,revalidate:()=>u});var o=t(49303),i=t(88716),l=t(60670),s=t(87070),n=t(37704),c=t(62270),p=t(79714);let u=3600;function m(e){return e.replace(/[<>&'"]/g,e=>{switch(e){case"<":return"&lt;";case">":return"&gt;";case"&":return"&amp;";case"'":return"&apos;";case'"':return"&quot;";default:return e}})}async function d(){let e=process.env.NEXT_PUBLIC_SITE_URL||"https://homes.alyora.in",r=[],t=[];try{[r,t]=await Promise.all([(0,n.Mw)().catch(()=>[]),(0,n.kQ)().catch(()=>[])])}catch(e){console.error("Error fetching sitemap data:",e)}let a=new Date().toISOString(),o=`<?xml version="1.0" encoding="UTF-8"?>
`;return o+=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`,[{url:`${e}`,priority:"1.0",changefreq:"daily"},{url:`${e}/properties`,priority:"0.9",changefreq:"daily"}].forEach(e=>{o+=`  <url>
    <loc>${m(e.url)}</loc>
    <lastmod>${a}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>
`}),["Villa","House","Apartment","Land","Commercial"].forEach(r=>{let t=`${e}/properties?type=${encodeURIComponent(r)}`;o+=`  <url>
    <loc>${m(t)}</loc>
    <lastmod>${a}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`}),(t||[]).forEach(r=>{let t=`${e}/properties?location=${encodeURIComponent(r.name)}`;o+=`  <url>
    <loc>${m(t)}</loc>
    <lastmod>${a}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`}),(r||[]).forEach(r=>{let t=(r._id||r.id||"").toString(),i=(0,p.E)(r.name||"property",r.location||"kerala",t),l=`${e}/properties/${i}`,s=r.updatedAt?new Date(r.updatedAt).toISOString():a;o+=`  <url>
    <loc>${m(l)}</loc>
    <lastmod>${s}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;let n=[],u=r.image?.secure_url||r.image_url;u&&"string"==typeof u&&u.startsWith("http")&&n.push({url:u,title:(0,c.cG)(r,void 0,0)}),Array.isArray(r.media)&&r.media.forEach((e,t)=>{e.secure_url&&"string"==typeof e.secure_url&&e.secure_url.startsWith("http")&&!n.some(r=>r.url===e.secure_url)&&n.push({url:e.secure_url,title:(0,c.cG)(r,e.caption,t+1)})}),n.forEach(e=>{o+=`    <image:image>
      <image:loc>${m(e.url)}</image:loc>
      <image:title>${m(e.title)}</image:title>
    </image:image>
`}),o+=`  </url>
`}),o+="</urlset>",new s.NextResponse(o,{status:200,headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"}})}let g=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"route",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"C:\\Users\\admin\\Downloads\\alyora_deign\\alyora-main\\src\\app\\sitemap.xml\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:h,staticGenerationAsyncStorage:y,serverHooks:f}=g,x="/sitemap.xml/route";function $(){return(0,l.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:y})}}};var r=require("../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[948,22,972,493],()=>t(8711));module.exports=a})();