## Komutlar 
- `et` ya da `ekranıtemizle` : ekranı temizler
- `ka`, `kalemal` : kalemi alır 
- `kb`, `kalembırak` : kalemi bırakır 
- `yazdir <ifade>` : ifadeyi yazdırır
- `kaydet <değişken> -> <ifade> ` : ifadeyi değişkene atar. 
- ` dön <ifade>` : saat yönünde ifade kadar derece döner. 
- `ileri <ifade>`: ileriye doğru ifade kadar px gider.
- `tekrarla <ifade> '[' <komutlar> ']' ` : komutları ifade kadar tekrarlar. 
- `renk <ifade>` : bir renk seçer şu an 13 tane renk var.

## Çember çiz  
`tekrarla 36 [dön 10 ileri 10]`


## Spiral çiz 
`kaydet a -> 10`
`t 10 [ t a [ dön 10 ileri a ] kaydet a -> a + 1 ]`

## Beşgen çiz 
`t 5 [dön 72 ileri 10 ]`

## Beşgen beşgen üstüne 
`kaydet a -> 10`
`t 7 [t 5[d 72 ileri a] kaydet a -> a + 10]`

## 1' den 10' a kadar olan sayıların yazımı
`kaydet a -> 1`
`t 10 [ yazdır a kaydet a -> a + 1]`

