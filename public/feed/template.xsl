<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="/feed/template.xsl"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <html lang="{@xml:lang}">
            <head>
                <link rel="stylesheet" href="/feed/style.css"/>
                <link rel="icon" href="/favicon.svg"/>
            </head>
            <body>
                <div class="header">
                    <span>有的人只拥吻影子，于是只拥有幸福的幻影。</span>
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
                    <details open="">
                        <summary />
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
                    <xsl:text> </xsl:text>
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
