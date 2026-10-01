<script lang="ts" setup>
  import { encodeXML } from "entities";
  import { variables } from "#build/feed.mjs";
  // @ts-expect-error Vite 内部模块
  import css from "./template.vue?vue&type=style&index=0&inline&lang.css";

  defineProps<{
    tagline: string;
  }>();
</script>

<!-- eslint-disable vue/component-name-in-template-casing -->
<template>
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
      <html lang="{@xml:lang}">
        <head>
          <style v-html="variables + encodeXML(css as string)"></style>
        </head>
        <body>
          <div class="header">
            <span>{{ tagline }}。</span>
          </div>
          <div class="pretty-print">
            <xsl:call-template name="node"/>
          </div>
        </body>
      </html>
    </xsl:template>
    <xsl:template name="node">
      <xsl:choose>
        <xsl:when test="self::processing-instruction()"/>
        <xsl:when test="name() = ''">
          <xsl:call-template name="children"/>
        </xsl:when>
        <xsl:when test="*[1] or @type = 'html'">
          <div class="folder">
            <xsl:call-template name="open-tag"/>
            <!-- @vue-expect-error -->
            <details open="">
              <summary ></summary>
              <div class="opened">
                <xsl:call-template name="children"/>
              </div>
            </details>
            <xsl:call-template name="close-tag"/>
          </div>
        </xsl:when>
        <xsl:when test="text()">
          <div class="line">
            <xsl:call-template name="open-tag"/>
            <xsl:value-of select="."/>
            <xsl:call-template name="close-tag"/>
          </div>
        </xsl:when>
        <xsl:otherwise>
          <div class="line">
            <xsl:call-template name="open-tag"/>
          </div>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>
    <xsl:template name="open-tag">
      <span class="html-tag">
        <span class="html-punctuation">
          <xsl:text>&lt;</xsl:text>
        </span>
        <xsl:value-of select="name()"/>
        <xsl:for-each select="@*">
          <span class="html-attribute">
            <xsl:text>&nbsp;</xsl:text>
            <span class="html-attribute-name"><xsl:value-of select="name()"/></span>
            <span class="html-punctuation">
              <xsl:text>=</xsl:text>
            </span>
            <span class="html-attribute-value">
              <xsl:text>"</xsl:text>
              <xsl:value-of select="."/>
              <xsl:text>"</xsl:text>
            </span>
          </span>
        </xsl:for-each>
        <span class="html-punctuation">
          <xsl:if test="not(node())">/</xsl:if>
          <xsl:text>&gt;</xsl:text>
        </span>
      </span>
    </xsl:template>
    <xsl:template name="children">
      <xsl:choose>
        <xsl:when test="*[1]">
          <xsl:for-each select="node()">
            <xsl:call-template name="node"/>
          </xsl:for-each>
        </xsl:when>
        <xsl:when test="@type = 'html'">
          &lt;![CDATA[ <xsl:value-of select="."/> ]]&gt;
        </xsl:when>
      </xsl:choose>
    </xsl:template>
    <xsl:template name="close-tag">
      <span class="html-tag">
        <span class="html-punctuation">
          <xsl:text>&lt;/</xsl:text>
        </span>
        <xsl:value-of select="name()"/>
        <span class="html-punctuation">
          <xsl:text>&gt;</xsl:text>
        </span>
      </span>
    </xsl:template>
  </xsl:stylesheet>
</template>

<style>
  body {
    margin: 0;
  }

  .header {
    margin: 10px;
    padding-bottom: 5px;
    border-bottom: 2px solid black;

    @media (prefers-color-scheme: dark) {
      border-color: white;
    }
  }

  .pretty-print {
    margin: 1em 0 0 20px;
    font-family: monospace;
    font-size: 13px;
    color: light-dark(var(--shiki-light-text), var(--shiki-dark-text));
  }

  details:not(:open)::after {
    content: "...";
  }

  summary {
    width: 0;
    margin: -1em 0 0 -10px;
    font-size: 12.4px;
    line-height: 1;

    &::marker {
      color: #909090;
      cursor: pointer;
    }
  }

  .html-punctuation {
    color: light-dark(var(--shiki-light-punctuation), var(--shiki-dark-punctuation));
  }

  .html-tag {
    color: light-dark(var(--shiki-light-tag), var(--shiki-dark-tag));
  }

  .html-attribute-name {
    color: light-dark(var(--shiki-light-attribute-name), var(--shiki-dark-attribute-name));
  }

  .html-attribute-value {
    color: light-dark(var(--shiki-light-attribute-value), var(--shiki-dark-attribute-value));
  }

  .opened {
    margin-left: 1em;
  }
</style>
