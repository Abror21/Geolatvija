<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE catelog [
<!ATTLIST xsl:stylesheet
  id    ID  #REQUIRED>
]>
<xsl:stylesheet id="stylesheet" version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" exclude-result-prefixes="atom">
<xsl:template match="/">
  <html>
  <head>
  <title>Download Service</title>
  <link rel="stylesheet" type="text/css" href="http://proxygds.viss.gov.lv/ATOM_design/ATOMServiceCSS.css"/>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.2/jquery.min.js">
  </script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery.colorbox/1.4.33/jquery.colorbox.js">  </script>
  <script>
  $('.image').colorbox({fixed:true,transition:"elastic",opacity:0.8,close:"X",closeButton:true,onComplete : function(){$( "#cboxClose" ).show();},onClosed : function(){$( "#cboxClose" ).hide();}});
  
  function apri(obj) {
	  
	  
	$( ".HiddenContent"+"-"+$(obj).attr('class') ).slideToggle( "fast", function() {
		//$( obj).toggleClass( "minus");
		$(obj).text(function(i, text){
          return text === "-" ? "+" : "-";
      })
	});
  };
  
  </script>

  </head>
  <body>
  
    
                  
                         
  <div class="header">
     <div class="logo"/>
  </div>	 
          
   <div class="content">
      
              <xsl:for-each select="atom:feed">
                                      
                  <div class="containerFirst"> 
                   <h1 class="FirstTitle"><xsl:value-of select="atom:title"/></h1>
                   
                   <xsl:if test="atom:subtitle"> 
                    <p class="Firstsubtitle"><xsl:value-of select="atom:subtitle"/></p>
                   </xsl:if>  
                   <p class="FirstAuthor"><xsl:value-of select="atom:author/atom:name"/></p>
                   
                  </div> 
                   
                   <div class="Info">
                   
                       <xsl:for-each select="atom:link">
                         <xsl:if test="@rel = 'describedby'">
                           <xsl:element name="a">
                                <xsl:attribute name="href">
                                    <xsl:value-of select="@href"/>
                                </xsl:attribute>
                                <xsl:attribute name="class">
                                     Info-link
                                </xsl:attribute>
                                Metadati
                            </xsl:element>
                         </xsl:if>
                       </xsl:for-each>
                        
                       <p class="Info-rights"><xsl:value-of select="atom:rights"/></p>
                    
                    </div>
                       
                    
              </xsl:for-each>
              
              
          <xsl:for-each select="atom:feed/atom:entry">	
             <div class="feedentry">

             <xsl:element name="div">
              
                <xsl:attribute name="class">
                    <xsl:value-of select="position()"/>
                </xsl:attribute>
                
                <xsl:attribute name="id">more</xsl:attribute>
                
                <xsl:attribute name="onclick">
                     apri(this)
                </xsl:attribute>
                
                +
             </xsl:element>
             	
                    
                <xsl:variable name="AuthorEntry" select="atom:author/atom:name"/>
                <xsl:variable name="EntryTitle" select="atom:title"/>
                
                
                <xsl:for-each select="atom:link">
                     <xsl:if test="@rel = 'alternate'">
                       <xsl:element name="a">
                            <xsl:attribute name="href">
                                <xsl:value-of select="@href"/>
                            </xsl:attribute>
                            <xsl:attribute name="class">
                                 EntryTitle
                            </xsl:attribute>
                            <xsl:value-of select="$EntryTitle"/>
                        </xsl:element> 
                        <span class="EntryAuthor">
                               <xsl:value-of select="$AuthorEntry"/>
                        </span>
                     </xsl:if>
                   </xsl:for-each>	
                
                <p class="date">
                  <xsl:value-of select="atom:updated"/>
                </p>
                
                <!--<div class="divisor"></div>-->
                
                <!--<div class="HiddenContent">-->
                <xsl:element name="div">
              
                    <xsl:attribute name="class">
                       HiddenContent  HiddenContent-<xsl:value-of select="position()"/>
                    </xsl:attribute>
                    
                    
                    
                    <div class="overflow">
                            
                         <xsl:if test="atom:summary">    
                            <xsl:if test="atom:thumb"> 
                              <div class="HiddenContentText">
                                <p class="summary">
                                  <xsl:value-of select="atom:summary"/>
                                </p>
                               </div>    
                             </xsl:if>   
                             
                             <xsl:if test="not(atom:thumb)"> 
                                <div class="HiddenContentText-full">
                                <p class="summary">
                                  <xsl:value-of select="atom:summary"/>
                                </p>
                               </div>   
                             </xsl:if> 
                          </xsl:if>      
                               
                            
                        <xsl:if test="atom:thumb"> 
                       
                        
                             <xsl:element name="a">
                                <xsl:attribute name="href">
                                    <xsl:value-of select="atom:thumb"/>
                                </xsl:attribute>
                                <xsl:attribute name="class">
                                     image
                                </xsl:attribute>
                                <div class="HiddenContentimage">
                                    <p><img width="100" height="auto">
                                        <xsl:attribute name="src">
                                            <xsl:value-of select="atom:thumb"/>
                                        </xsl:attribute>
                                    </img></p>
                                 </div>
                             </xsl:element>
                             
                         
                         </xsl:if>    
                         
                         
                          
                    </div>  
                        
                        <xsl:for-each select="atom:link">
                                     <xsl:if test="@rel = 'describedby'">
                                       <xsl:element name="a">
                                            <xsl:attribute name="href">
                                                <xsl:value-of select="@href"/>
                                            </xsl:attribute>
                                            <xsl:attribute name="class">
                                                 Info-link-entry
                                            </xsl:attribute>
                                            Metadati
                                        </xsl:element>
                                     </xsl:if>
                                   </xsl:for-each>	
                        <p class="Entryrights">
                          <xsl:value-of select="atom:rights"/>
                        </p>
                 </xsl:element>
                            
                        
                        
                        
                        
                  </div>      
            <!--</div>-->	
          </xsl:for-each>
              
              
     </div>	  
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>