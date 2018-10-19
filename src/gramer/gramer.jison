/* description: Parses end evaluates mathematical expressions. */

/* lexical grammar */

%lex
%%

\s+                	  {/* skip whitespace */}
\d+(\.\d+)?			  {return 'NUM'; }
"arkaplan"			  {return 'ARKAPLAN'; }
"ap"				  {return 'ARKAPLAN'; }
"ileri"				  {return 'ILERI'; }
"t"					  {return 'TEKRAR';}
"tekrarla"			  {return 'TEKRAR';}
"d\u00f6n"			  {return 'DONDUR'; }
"d"					  {return 'DONDUR';}
"kyd"				  {return 'KAYDET';}
"kaydet"			  {return 'KAYDET';}
"yazd\u0131r"		  {return 'YAZDIR'; }
"yzdr"				  {return 'YAZDIR';}
"sa\u011f"			  {return 'SAG'; }
"sa\u11fagit"		  {return 'SAG'; }
"sol"				  {return 'SOL'; }
"solagit"			  {return 'SOL'; }
"alt"				  {return 'ALT'; }
"altagit"			  {return 'ALT'; }
"\u00fcst"			  {return 'UST'; }
"\u00fcstegit"		  {return 'UST'; }
"ka"				  {return 'KA'; }
"kalemal"			  {return 'KA'; }
"kb"				  {return 'KB'; }
"kalemb\u0131rak"     {return 'KB'; }
"et"				  {return 'ET'; }
"ekran\u0131temizle"  {return 'ET'; }
"renk"				  {return 'RENK';}
"->" 				  {return "ATAMA"}
":"					  {return ':'; }
"*"                   {return '*';}
"/"                   {return '/';}
"-"                   {return '-';}
"+"                   {return '+';}
"^"                   {return '^';}
"("                   {return '(';}
")"                   {return ')';}
"[" 				  {return '[';}
"]"					  {return ']';}
"$"               	  {return 'EOF';}
[a-z][a-z0-9_]*		  {return 'ID'; }
/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start program

%% /* language grammar */



program	    : komut EOF	  { interp($1); console.log($1); }
			; 

komut	    : TEKRAR e  '[' komutlar ']'  {$$ = new Komut(komut_tipi.TEKRAR, $2, $4); }
			| DONDUR e 					  {$$ = new Komut(komut_tipi.DONDUR, $2, 0); }
			| KAYDET  ID ATAMA e		  {$$ = new Komut(komut_tipi.KAYDET, $4, new Exp_Id($2)); }
			| ILERI e 					  {$$ = new Komut(komut_tipi.ILERI, $2, 0); }
			| KA 						  {$$ = new Komut(komut_tipi.KA, 0, 0); }
			| KB  						  {$$ = new Komut(komut_tipi.KB, 0, 0); }
			| ET						  {$$ = new Komut(komut_tipi.ET, 0, 0); }
			| YAZDIR e 					  {$$ = new Komut(komut_tipi.YAZDIR, $2, 0); }
			| RENK e					  {$$ = new Komut(komut_tipi.RENK, $2, 0);}
			; 
			
komutlar 	: komut komutlar			  {$$ = new Komutlar($1, $2); }
			| komut 				      {$$ = $1;}
			; 
			
e
	: e '+' e							  {$$ = new Exp_Op($1, exp_ops.PLUS, $3); } 
	| e '-' e							  {$$ = new Exp_Op($1, exp_ops.MINUS, $3); } 
	| e '*' e							  {$$ = new Exp_Op($1, exp_ops.TIME, $3); } 
	| e '/' e							  {$$ = new Exp_Op($1, exp_ops.DIV, $3); } 
	| '(' e ')'							  {$$ = $2; }
	| '-' e %prec UMINUS				  {$$ = new Exp_Op($2, exp_ops.UMINUS, 0); }
	| NUM							  	  {$$ = new Exp_Num(parseFloat($1)); }
	| ID						  		  {$$ = new Exp_Id($1);  } 
	;

