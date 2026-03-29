<template><div><h1 id="quic协议开源实现列表" tabindex="-1"><a class="header-anchor" href="#quic协议开源实现列表"><span>QUIC协议开源实现列表</span></a></h1>
<h2 id="框架和开源实现" tabindex="-1"><a class="header-anchor" href="#框架和开源实现"><span>框架和开源实现</span></a></h2>
<h3 id="c-c" tabindex="-1"><a class="header-anchor" href="#c-c"><span>C/C++</span></a></h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Version</th>
<th>Roles</th>
<th>Handshake</th>
</tr>
</thead>
<tbody>
<tr>
<td>Microsoft's <a href="https://github.com/microsoft/msquic" target="_blank" rel="noopener noreferrer">MsQuic</a></td>
<td>draft-27/28/29/30/31/32</td>
<td>client, server</td>
<td>TLS 1.3 RFC</td>
</tr>
<tr>
<td>Facebook's <a href="https://github.com/facebookincubator/mvfst" target="_blank" rel="noopener noreferrer">mvfst</a></td>
<td>draft-29</td>
<td>library, client, server</td>
<td>TLS 1.3</td>
</tr>
<tr>
<td>Google's <a href="https://www.chromium.org/quic/playing-with-quic" target="_blank" rel="noopener noreferrer">Chromium</a></td>
<td>Q043, Q046, Q050, T050, T051, draft-27, draft-29</td>
<td>library, client, server</td>
<td>QUIC Crypto, TLS</td>
</tr>
<tr>
<td><a href="https://cwiki.apache.org/confluence/display/TS/QUIC" target="_blank" rel="noopener noreferrer">ats</a> (Apache Traffic Server)</td>
<td>draft-29</td>
<td>client. server</td>
<td>TLS 1.3</td>
</tr>
<tr>
<td>LiteSpeed's <a href="https://github.com/litespeedtech/lsquic" target="_blank" rel="noopener noreferrer">lsquic</a></td>
<td>Draft-32, Draft-29, Draft-28, Draft-27, Q043, Q046, and Q050.</td>
<td>library, client, server</td>
<td>QUIC Crypto, RFC 8446</td>
</tr>
<tr>
<td><a href="https://github.com/ngtcp2/ngtcp2" target="_blank" rel="noopener noreferrer">ngtcp2</a></td>
<td>draft-29, draft-30, draft-31, and draft-32</td>
<td>library, client, server</td>
<td>TLSv1.3 (RFC 8446)</td>
</tr>
<tr>
<td>Cloudflare's <a href="https://github.com/cloudflare/quiche/tree/master/extras/nginx" target="_blank" rel="noopener noreferrer">nginx-cloudflare</a></td>
<td>draft-27, draft-28, draft-29</td>
<td>server</td>
<td>TLSv1.3 (RFC8446)</td>
</tr>
<tr>
<td><a href="https://github.com/private-octopus/picoquic" target="_blank" rel="noopener noreferrer">picoquic</a></td>
<td>draft-32/31/30/29/28/27</td>
<td>library and test tools, test client, test server</td>
<td>TLS 1.3 (using picotls)</td>
</tr>
<tr>
<td><a href="https://github.com/p-quic/pquic" target="_blank" rel="noopener noreferrer">Pluginized QUIC</a></td>
<td>draft-29</td>
<td>library, client, server</td>
<td>TLS 1.3 (using picotls)</td>
</tr>
<tr>
<td><a href="https://github.com/NTAP/quant" target="_blank" rel="noopener noreferrer">quant</a></td>
<td>draft-33, draft-34, v1</td>
<td>library, client, server</td>
<td>TLS 1.3</td>
</tr>
<tr>
<td>Fastly's <a href="https://github.com/h2o/quicly" target="_blank" rel="noopener noreferrer">quicly</a></td>
<td>draft-27</td>
<td>client, server</td>
<td>TLS 1.3 (final)</td>
</tr>
<tr>
<td><a href="https://hg.nginx.org/nginx-quic/" target="_blank" rel="noopener noreferrer">nginx-quic</a></td>
<td>draft-27 .. draft-32</td>
<td>server</td>
<td>TLSv1.3 (RFC8446)</td>
</tr>
<tr>
<td>Alibaba's <a href="https://github.com/alibaba/xquic" target="_blank" rel="noopener noreferrer">xquic</a></td>
<td>draft-29</td>
<td>library</td>
<td>TLSv1.3</td>
</tr>
<tr>
<td>Google's <a href="https://github.com/google/quiche" target="_blank" rel="noopener noreferrer">quiche</a></td>
<td>draft-29</td>
<td>library</td>
<td>TLSv1.3</td>
</tr>
</tbody>
</table>
<h3 id="rust" tabindex="-1"><a class="header-anchor" href="#rust"><span>Rust</span></a></h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Version</th>
<th>Roles</th>
<th>Handshake</th>
</tr>
</thead>
<tbody>
<tr>
<td>Cloudflare's <a href="https://github.com/cloudflare/quiche" target="_blank" rel="noopener noreferrer">quiche</a></td>
<td>draft-27, draft-28, draft-29</td>
<td>library, client, server</td>
<td>TLSv1.3 (RFC8446)</td>
</tr>
<tr>
<td>Mozilla/Firefox's <a href="https://github.com/mozilla/neqo" target="_blank" rel="noopener noreferrer">Neqo</a></td>
<td>draft-30</td>
<td>library, client, server</td>
<td>TLS 1.3</td>
</tr>
<tr>
<td><a href="https://github.com/djc/quinn" target="_blank" rel="noopener noreferrer">Quinn</a></td>
<td>draft-28</td>
<td>library, client, server</td>
<td>TLS 1.3</td>
</tr>
</tbody>
</table>
<h3 id="go" tabindex="-1"><a class="header-anchor" href="#go"><span>Go</span></a></h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Version</th>
<th>Roles</th>
<th>Handshake</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/lucas-clemente/quic-go" target="_blank" rel="noopener noreferrer">quic-go</a></td>
<td>always the current draft</td>
<td>library, client, server</td>
<td>TLS 1.3 RFC</td>
</tr>
</tbody>
</table>
<h3 id="node-js" tabindex="-1"><a class="header-anchor" href="#node-js"><span>Node.js</span></a></h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Version</th>
<th>Roles</th>
<th>Handshake</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nodejs/quic" target="_blank" rel="noopener noreferrer">Node.js QUIC</a></td>
<td>draft-25</td>
<td>client, server</td>
<td>TLS 1.3</td>
</tr>
</tbody>
</table>
<h3 id="python" tabindex="-1"><a class="header-anchor" href="#python"><span>Python</span></a></h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Version</th>
<th>Roles</th>
<th>Handshake</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/aiortc/aioquic" target="_blank" rel="noopener noreferrer">aioquic</a></td>
<td>draft-29</td>
<td>library, client, server</td>
<td>TLS 1.3</td>
</tr>
</tbody>
</table>
<h3 id="haskell" tabindex="-1"><a class="header-anchor" href="#haskell"><span>Haskell</span></a></h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Version</th>
<th>Roles</th>
<th>Handshake</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/kazu-yamamoto/quic" target="_blank" rel="noopener noreferrer">Haskell quic</a></td>
<td>draft-29</td>
<td>library, client, server</td>
<td>TLS 1.3</td>
</tr>
</tbody>
</table>
<h3 id="java" tabindex="-1"><a class="header-anchor" href="#java"><span>Java</span></a></h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Version</th>
<th>Roles</th>
<th>Handshake</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://bitbucket.org/pjtr/kwik" target="_blank" rel="noopener noreferrer">kwik</a></td>
<td>draft-29, draft-30, draft-31, draft-32</td>
<td>library, client</td>
<td>TLS 1.3</td>
</tr>
</tbody>
</table>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://github.com/xileteam/awesome-quic" target="_blank" rel="noopener noreferrer">Awesome QUIC</a></li>
</ul>
</div></template>


