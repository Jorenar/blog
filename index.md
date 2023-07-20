---
layout: default
---

<nav>
  <a href="{{ 'feed.xml' | relative_url }}">RSS</a>
</nav>

<ul class="post-list">
{%- for post in site.posts -%}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  </li>
{%- endfor -%}
</ul>
