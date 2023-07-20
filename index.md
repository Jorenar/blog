---
layout: default
---

<script>
  if (window === window.parent) {
      window.location.href.replace(window.location.origin + "#blog");
  }
</script>

<ul class="post-list">
{%- for post in site.posts -%}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  </li>
{%- endfor -%}
</ul>
