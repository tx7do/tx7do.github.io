import{c as U}from"./chunk-JQRUD6KW-Bo-dSmJV.js";import{d as X}from"./wardley-L42UT6IY-5TKZOOLJ-UVzZ3TVY.js";import{a as Z,l as _,s as ee,e as te,o as ae,n as ie,m as l,p as $,q as le,L as re,a8 as se,a9 as oe,aa as L,ab as ne,b as pe,u as de,ac as ce,E as ue}from"./mermaid.esm.min-CHFvGJUy.js";import"./app-DRIJSW8-.js";var ge=ue.pie,v={sections:new Map,showData:!1},h=v.sections,y=v.showData,he=structuredClone(ge),me=l(()=>structuredClone(he),"getConfig"),fe=l(()=>{h=new Map,y=v.showData,de()},"clear"),xe=l(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);h.has(e)||(h.set(e,a),$.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),we=l(()=>h,"getSections"),Se=l(e=>{y=e},"setShowData"),$e=l(()=>y,"getShowData"),W={getConfig:me,clear:fe,setDiagramTitle:ie,getDiagramTitle:ae,setAccTitle:te,getAccTitle:ee,setAccDescription:_,getAccDescription:Z,addSection:xe,getSections:we,setShowData:Se,getShowData:$e},ve=l((e,a)=>{U(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ye={parse:l(async e=>{let a=await X("pie",e);$.debug(a),ve(a,W)},"parse")},Te=l(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),be=Te,De=l(e=>{let a=[...e.values()].reduce((r,s)=>r+s,0),T=[...e.entries()].map(([r,s])=>({label:r,value:s})).filter(r=>r.value/a*100>=1);return ce().value(r=>r.value).sort(null)(T)},"createPieArcs"),Ce=l((e,a,T,r)=>{var B;$.debug(`rendering pie chart
`+e);let s=r.db,b=le(),D=re(s.getConfig(),b.pie),C=40,o=18,c=4,p=450,d=p,m=se(a),n=m.append("g");n.attr("transform","translate("+d/2+","+p/2+")");let{themeVariables:i}=b,[k]=oe(i.pieOuterStrokeWidth);k??(k=2);let A=D.textPosition,u=Math.min(d,p)/2-C,P=L().innerRadius(0).outerRadius(u),q=L().innerRadius(u*A).outerRadius(u*A);n.append("circle").attr("cx",0).attr("cy",0).attr("r",u+k/2).attr("class","pieOuterCircle");let g=s.getSections(),j=De(g),G=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12],f=0;g.forEach(t=>{f+=t});let M=j.filter(t=>(t.data.value/f*100).toFixed(0)!=="0"),x=ne(G).domain([...g.keys()]);n.selectAll("mySlices").data(M).enter().append("path").attr("d",P).attr("fill",t=>x(t.data.label)).attr("class","pieCircle"),n.selectAll("mySlices").data(M).enter().append("text").text(t=>(t.data.value/f*100).toFixed(0)+"%").attr("transform",t=>"translate("+q.centroid(t)+")").style("text-anchor","middle").attr("class","slice");let H=n.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),O=[...g.entries()].map(([t,S])=>({label:t,value:S})),w=n.selectAll(".legend").data(O).enter().append("g").attr("class","legend").attr("transform",(t,S)=>{let E=o+c,J=E*O.length/2,K=12*o,Q=S*E-J;return"translate("+K+","+Q+")"});w.append("rect").attr("width",o).attr("height",o).style("fill",t=>x(t.label)).style("stroke",t=>x(t.label)),w.append("text").attr("x",o+c).attr("y",o-c).text(t=>s.getShowData()?`${t.label} [${t.value}]`:t.label);let N=Math.max(...w.selectAll("text").nodes().map(t=>(t==null?void 0:t.getBoundingClientRect().width)??0)),V=d+C+o+c+N,R=((B=H.node())==null?void 0:B.getBoundingClientRect().width)??0,Y=d/2-R/2,I=d/2+R/2,z=Math.min(0,Y),F=Math.max(V,I)-z;m.attr("viewBox",`${z} 0 ${F} ${p}`),pe(m,p,F,D.useMaxWidth)},"draw"),ke={draw:Ce},ze={parser:ye,db:W,renderer:ke,styles:be};export{ze as diagram};
