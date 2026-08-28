-- ============================================================
--  MUMZZMUM · Brand archive bulk import (30 brands)
--  Run once in: Supabase Dashboard → SQL Editor → paste → Run.
--  Safe to re-run: `on conflict (slug) do nothing` skips existing slugs.
--  Text uses $b$…$b$ dollar-quoting so Korean quotes/apostrophes are fine.
-- ============================================================

insert into public.brands
  (slug, name, country, founded, target, mood, description, what_i_like)
values
($b$amomento$b$, $b$AMOMENTO$b$, $b$South Korea$b$, $b$2016$b$, $b$20대 · 30대$b$, $b$Minimal · Casual · Luxury$b$,
 $b$타임리스 클래식을 절제된 디자인과 건축적인 실루엣으로 재해석하는 서울 기반 브랜드. 독자적인 소재 개발과 정교한 디테일을 통해 일상에서 편안하게 입을 수 있으면서도 분명한 미학을 가진 옷을 만든다. 트렌드를 빠르게 좇기보다 오래 입을 수 있는 형태와 소재에 집중한다.$b$,
 $b$기본적인 옷처럼 보이지만 실루엣과 소재에서 미묘한 차이를 만들어내는 점이 좋다. 과하게 설명하지 않아도 브랜드의 색이 느껴지고, '조용한 럭셔리'라는 키워드를 가장 잘 보여주는 국내 브랜드 중 하나라고 생각한다.$b$),

($b$amomento-plus$b$, $b$AMOMENTO PLUS$b$, $b$South Korea$b$, $b$2024$b$, $b$20대 · 30대$b$, $b$Minimal · Casual · Luxury$b$,
 $b$AMOMENTO의 기존 미학을 보다 일상적이고 실용적인 방향으로 확장한 라인. 절제된 디자인과 편안한 실루엣을 기반으로 데일리웨어의 활용도를 높이면서도 AMOMENTO 특유의 정제된 분위기를 유지한다. 기본적인 아이템을 중심으로 소재와 컬러, 디테일의 균형을 통해 자연스럽게 오래 입을 수 있는 옷을 제안한다.$b$,
 $b$AMOMENTO보다 조금 더 편하게 접근할 수 있으면서도 브랜드 특유의 미니멀한 색이 유지되는 점이 좋다. 특별히 힘을 준 것처럼 보이지 않는데 핏이나 소재에서 은근히 차이가 느껴지고, 실제 옷장에 넣었을 때 활용도가 높은 브랜드라는 점이 매력적이다.$b$),

($b$baserange$b$, $b$Baserange$b$, $b$Denmark / France$b$, $b$2012$b$, $b$20대 · 30대$b$, $b$Minimal · Casual · Romantic$b$,
 $b$여성용 언더웨어에서 시작해 일상적인 의류 전반으로 확장한 미니멀 브랜드. 자연 소재와 재활용 소재를 활용하며 몸과 환경을 함께 고려하는 디자인을 추구한다. 성별과 연령에 크게 구애받지 않는 편안한 실루엣이 특징이다.$b$,
 $b$꾸미지 않은 듯한데 소재와 컬러만으로 분위기가 만들어진다. 속옷과 홈웨어의 경계를 허물면서도 브랜드의 미학이 확실하다.$b$),

($b$repos$b$, $b$REPOS$b$, $b$South Korea$b$, null, $b$20대 · 30대$b$, $b$Minimal · Romantic · Casual$b$,
 $b$일상적인 여성복을 기반으로 자연스러운 실루엣과 소재, 부드러운 분위기를 전개하는 컨템포러리 브랜드.$b$,
 $b$과하게 여성스럽거나 트렌디하지 않으면서도 여성적인 분위기를 만들어내는 방식. 힘을 빼고 입을 수 있는 옷에서 브랜드의 캐릭터를 만드는 점이 좋다.$b$),

($b$repetto$b$, $b$Repetto$b$, $b$France$b$, $b$1947$b$, $b$20대 · 30대 · 40대$b$, $b$Romantic · Vintage · Luxury$b$,
 $b$1947년 Rose Repetto가 파리 오페라 인근에서 발레 슈즈를 만들며 시작한 프랑스 브랜드. 발레에서 출발한 우아한 실루엣과 장인정신을 바탕으로 발레 플랫, 슈즈, 의류와 액세서리까지 확장했다.$b$,
 $b$발레라는 명확한 브랜드 헤리티지를 일상적인 제품으로 자연스럽게 연결한다. Cendrillon 같은 아이코닉한 제품 하나만으로도 브랜드 이미지가 설명되는 점이 인상적이다.$b$),

($b$saint-laurent$b$, $b$Saint Laurent$b$, $b$France$b$, $b$1961$b$, $b$20대 · 30대 · 40대$b$, $b$Luxury · Vintage · Romantic · Avant-garde$b$,
 $b$Yves Saint Laurent가 1961년 설립한 프랑스 럭셔리 하우스. 남성복의 요소를 여성복에 가져오며 여성의 자유와 강한 이미지를 표현했고, 1966년에는 혁신적인 기성복 라인 Rive Gauche를 선보였다.$b$,
 $b$섹시함과 남성적인 테일러링을 동시에 가져가는 방식. 단순히 화려한 럭셔리가 아니라 강한 이미지와 태도를 옷으로 만든다는 점이 좋다.$b$),

($b$tom-ford$b$, $b$Tom Ford$b$, $b$United States$b$, $b$2005$b$, $b$30대 · 40대$b$, $b$Luxury · Romantic · Vintage$b$,
 $b$2005년 Tom Ford가 설립한 글로벌 럭셔리 하우스. 정교한 테일러링과 관능적인 실루엣, 세련된 소재와 강한 이미지를 통해 현대적인 럭셔리를 표현한다.$b$,
 $b$브랜드가 전달하는 이미지가 굉장히 명확하다. 옷 자체뿐 아니라 사진, 공간, 모델, 향수까지 모두 같은 세계관 안에서 움직인다.$b$),

($b$still-here$b$, $b$Still Here$b$, $b$United States$b$, $b$2018$b$, $b$20대 · 30대$b$, $b$Vintage · Americana · Casual · Street$b$,
 $b$뉴욕을 기반으로 하는 데님 브랜드. 미국 데님의 헤리티지를 바탕으로 100% 코튼 진을 만들며, 시간이 지나며 찢어지고 바래고 패치되는 과정까지 제품의 일부로 바라본다.$b$,
 $b$단순히 '예쁜 데님'을 만드는 게 아니라 데님이 오래 입히면서 만들어지는 개인적인 기억까지 브랜드 스토리로 가져가는 점이 좋다.$b$),

($b$erl$b$, $b$ERL$b$, $b$United States$b$, $b$2018$b$, $b$20대$b$, $b$Street · Americana · Vintage · Avant-garde$b$,
 $b$Eli Russell Linnetz가 Los Angeles에서 시작한 브랜드. 미국 서부의 스케이트, 서핑, 청춘문화와 빈티지 아메리카나를 영화적인 이미지와 과장된 실루엣으로 재해석한다.$b$,
 $b$미국적인 소재와 아이템을 굉장히 자유롭게 비틀어낸다. 패션뿐 아니라 영화, 음악, 아트까지 하나의 문화적 세계관처럼 연결하는 방식이 좋다.$b$),

($b$helmut-lang$b$, $b$Helmut Lang$b$, $b$Austria / United States$b$, $b$1986$b$, $b$20대 · 30대 · 40대$b$, $b$Minimal · Avant-garde · Street · Workwear$b$,
 $b$오스트리아 출신 디자이너 Helmut Lang이 1986년 설립한 브랜드. 미니멀리즘과 기능주의, 산업적인 디테일을 기반으로 절제된 실루엣을 선보여 현대 패션의 미니멀리즘에 큰 영향을 주었다.$b$,
 $b$'덜어내는 것' 자체를 디자인으로 만드는 방식. 로고나 장식보다 소재, 비율, 구조만으로 강한 인상을 만든다.$b$),

($b$mudule$b$, $b$Müdule$b$, $b$South Korea$b$, $b$2019$b$, $b$20대 · 30대$b$, $b$Minimal · Avant-garde · Casual$b$,
 $b$모듈 시스템에서 영감을 받아 젠더리스 디자인과 정제된 실루엣을 탐구하는 한국 브랜드. 기본적이고 간결한 형태를 바탕으로 소재와 비율을 섬세하게 조율하며 타임리스 웨어를 지향한다.$b$,
 $b$기본적인 옷인데 비율과 소재에서 묘하게 다른 느낌이 난다. 과하게 디자인하지 않고도 브랜드만의 분위기를 만드는 방식이 좋다.$b$),

($b$jjjjound$b$, $b$JJJJound$b$, $b$Canada$b$, $b$2006$b$, $b$20대 · 30대$b$, $b$Minimal · Vintage · Street · Americana$b$,
 $b$2006년 디지털 무드보드로 시작해 현재는 제품, 공간, 그래픽, 협업 등을 아우르는 디자인 스튜디오로 성장했다. 클래식한 일상용품을 색상과 소재, 비율만으로 재해석하며 절제된 디자인과 지속성을 강조한다.$b$,
 $b$'아무것도 안 한 것 같은데 갖고 싶은 것'을 만드는 능력. 브랜드 로고보다 큐레이션과 색감, 제품 자체가 브랜드가 되는 방식이 인상적이다.$b$),

($b$alaia$b$, $b$Alaïa$b$, $b$France$b$, $b$1964$b$, $b$30대 · 40대$b$, $b$Luxury · Romantic · Avant-garde$b$,
 $b$Azzedine Alaïa가 1964년 파리에서 설립한 럭셔리 하우스. 여성의 신체를 조각하듯 강조하는 니트, 가죽, 테일러링과 독특한 장인기술을 통해 몸과 의복의 관계를 탐구한다.$b$,
 $b$옷이 단순한 의복이 아니라 조각처럼 느껴진다. 여성의 몸을 숨기기보다 실루엣 자체를 디자인의 중심으로 삼는 점이 강렬하다.$b$),

($b$helsa$b$, $b$HELSA$b$, $b$United States$b$, $b$2022$b$, $b$20대 · 30대$b$, $b$Minimal · Vintage · Luxury · Casual$b$,
 $b$모델 Elsa Hosk가 2022년 설립한 브랜드. Scandinavian sensibility와 California lifestyle을 결합해 편안하면서도 세련된 여성복을 제안한다. 빈티지한 미국적 요소와 미니멀한 실루엣을 함께 사용하는 것이 특징이다.$b$,
 $b$모델 개인의 이미지와 브랜드의 무드가 자연스럽게 연결된다. '꾸민 듯 안 꾸민 듯한 미국 여성의 옷장'을 만드는 방식이 좋다.$b$),

($b$lemaire$b$, $b$LEMAIRE$b$, $b$France$b$, $b$1991$b$, $b$30대 · 40대$b$, $b$Minimal · Luxury · Casual$b$,
 $b$Christophe Lemaire가 1991년 설립한 파리 기반 패션 하우스. 형태와 기능의 균형, 유연한 실루엣, 고급 소재와 절제된 디테일을 통해 오래 입을 수 있는 일상복을 만든다.$b$,
 $b$내가 생각하는 '조용한 럭셔리'에 가장 가까운 브랜드 중 하나. 특별한 장식 없이도 원단과 실루엣만으로 고급스러움이 느껴진다.$b$),

($b$paloma-wool$b$, $b$Paloma Wool$b$, $b$Spain$b$, $b$2014$b$, $b$20대 · 30대$b$, $b$Romantic · Vintage · Avant-garde · Casual$b$,
 $b$바르셀로나를 기반으로 한 패션 프로젝트. 니트웨어와 여성복을 중심으로 예술, 사진, 음악과 연결되는 독특한 비주얼을 구축하며 로컬 생산자들과 긴밀하게 협업한다.$b$,
 $b$옷만 보는 것이 아니라 브랜드의 이미지와 사진, 아트 디렉션까지 함께 봤을 때 완성되는 브랜드라는 점이 좋다.$b$),

($b$recto$b$, $b$RECTO$b$, $b$South Korea$b$, $b$2015$b$, $b$20대 · 30대$b$, $b$Minimal · Luxury · Workwear$b$,
 $b$클래식한 테일러링과 현대적인 실루엣을 기반으로 하는 한국 컨템포러리 브랜드. 남성복과 여성복의 경계를 넘나드는 구조적인 디자인과 절제된 컬러를 특징으로 한다.$b$,
 $b$한국적인 미니멀리즘을 너무 무겁지 않게 보여준다. 클래식한 아이템을 현대적인 비율로 바꾸는 방식이 좋다.$b$),

($b$posse$b$, $b$Posse$b$, $b$Australia$b$, $b$2016$b$, $b$20대 · 30대$b$, $b$Minimal · Romantic · Casual$b$,
 $b$Sydney 기반의 여성복 브랜드. 리넨 셋업, 미니멀한 드레스와 자연스러운 실루엣을 중심으로 유행을 타지 않는 옷장을 제안한다.$b$,
 $b$휴양지에서 입을 법한 옷인데 일상에서도 자연스럽게 연결된다. 소재와 실루엣만으로 라이프스타일을 보여주는 방식이 좋다.$b$),

($b$fruity-booty$b$, $b$Fruity Booty$b$, $b$United Kingdom$b$, $b$2017/2018$b$, $b$20대$b$, $b$Romantic · Vintage · Casual$b$,
 $b$Hattie Tennant와 Minna Bunting이 시작한 런던 기반 여성 언더웨어 브랜드. 데드스톡 소재와 장난스러운 컬러, 빈티지한 여성복 디테일을 결합해 속옷과 아우터의 경계를 흐린다.$b$,
 $b$브랜드의 핵심 메시지와 비주얼이 일치한다. 여성의 시선을 위한 섹시함이라는 명확한 관점이 있고, 이를 컬러와 소재, 촬영으로 일관되게 표현한다.$b$),

($b$extreme-cashmere$b$, $b$extreme cashmere$b$, $b$Netherlands$b$, $b$2016$b$, $b$30대 · 40대$b$, $b$Minimal · Luxury · Casual$b$,
 $b$Saskia Dijkstra가 2016년 설립한 네덜란드 캐시미어 브랜드. 하나의 사이즈가 다양한 사람에게 어울리는 디자인에서 출발해 고품질 캐시미어를 중심으로 오래 입는 니트웨어 컬렉션을 구축한다.$b$,
 $b$소재 하나를 브랜드 전체의 정체성으로 만든다. '캐시미어를 잘 만드는 브랜드'라는 메시지가 너무 명확해서 브랜드를 기억하기 쉽다.$b$),

($b$jil-sander$b$, $b$Jil Sander$b$, $b$Germany$b$, $b$1968$b$, $b$30대 · 40대$b$, $b$Minimal · Luxury · Avant-garde$b$,
 $b$Jil Sander가 1968년 설립한 독일 럭셔리 브랜드. 절제된 실루엣, 뛰어난 소재, 기능성과 순수한 형태를 결합하며 현대적인 미니멀리즘의 대표적인 하우스로 자리 잡았다.$b$,
 $b$'미니멀한 옷'의 기준을 만든 브랜드. 장식을 덜어내는 것뿐 아니라 소재와 패턴, 봉제까지 완성도를 높여서 고급스러움을 만드는 점이 좋다.$b$),

($b$the-row$b$, $b$The Row$b$, $b$United States$b$, $b$2006$b$, $b$30대 · 40대$b$, $b$Minimal · Luxury · Casual$b$,
 $b$뉴욕을 기반으로 하는 럭셔리 브랜드. 최고급 소재와 완벽한 테일러링, 절제된 컬러와 여유로운 실루엣을 통해 로고나 장식보다 제품 자체의 품질을 강조한다.$b$,
 $b$내가 생각하는 '조용한 럭셔리'의 대표적인 사례. 멀리서 봤을 때는 평범해 보일 수 있지만 가까이에서 보면 소재와 핏이 완전히 다르다.$b$),

($b$toteme$b$, $b$TOTEME$b$, $b$Sweden$b$, $b$2014$b$, $b$20대 · 30대 · 40대$b$, $b$Minimal · Luxury · Casual$b$,
 $b$Elin Kling과 Karl Lindman이 2014년 설립한 스웨덴 패션 하우스. 스웨덴 특유의 절제된 감각을 바탕으로 소재, 형태, 그래픽적인 실루엣을 강조하며 현대 여성의 다양한 라이프스타일에 맞는 옷을 제안한다.$b$,
 $b$브랜드가 굉장히 정돈되어 있다. 옷, 로고, 매장, 촬영 이미지까지 모두 하나의 세계관처럼 연결되어 있어 브랜딩 레퍼런스로 특히 좋다.$b$),

($b$khaite$b$, $b$KHAITE$b$, $b$United States$b$, $b$2016$b$, $b$30대 · 40대$b$, $b$Luxury · Romantic · Vintage$b$,
 $b$Catherine Holstein이 2016년 뉴욕에서 설립한 여성복 브랜드. 남성적 요소와 여성적인 요소, 구조적인 형태와 부드러운 소재를 대비시키며 현대적인 관능미를 표현한다.$b$,
 $b$여성스러운데 과하게 달콤하지 않다. 데님, 니트, 가죽 같은 익숙한 아이템을 고급스럽고 세련된 방식으로 재해석하는 점이 좋다.$b$),

($b$studio-nicholson$b$, $b$Studio Nicholson$b$, $b$United Kingdom$b$, $b$2010$b$, $b$30대 · 40대$b$, $b$Minimal · Workwear · Casual$b$,
 $b$Nick Wakeman이 2010년 런던에서 설립한 브랜드. 'fabric first' 철학을 기반으로 평범한 일상복을 좋은 소재와 정확한 실루엣으로 재구성한다. 클래식한 옷을 현대적으로 업데이트하는 것이 핵심이다.$b$,
 $b$'옷보다 패션이 아닌 옷 자체를 좋아한다'는 철학이 명확하다. 평범한 셔츠나 팬츠도 원단과 패턴만으로 특별하게 만드는 점이 특히 좋다.$b$),

($b$margaret-howell$b$, $b$Margaret Howell$b$, $b$United Kingdom$b$, $b$1970$b$, $b$30대 · 40대$b$, $b$Workwear · Vintage · Minimal · Americana$b$,
 $b$영국 디자이너 Margaret Howell이 1970년 시작한 브랜드. 전통적인 영국 셔츠, 워크웨어, 테일러링에서 영감을 받아 편안한 실루엣과 좋은 소재를 통해 현대적인 일상복으로 재해석한다.$b$,
 $b$시간이 지나도 촌스럽지 않은 옷을 만든다. 워크웨어와 남성복의 요소를 여성복에 자연스럽게 섞는 방식이 좋고, '오래 입는 옷'이라는 가치가 확실하다.$b$),

($b$dries-van-noten$b$, $b$Dries Van Noten$b$, $b$Belgium$b$, $b$1986$b$, $b$30대 · 40대$b$, $b$Vintage · Romantic · Avant-garde · Luxury$b$,
 $b$벨기에 디자이너 Dries Van Noten의 패션 하우스. 전통적인 테일러링과 풍부한 색감, 프린트, 예술과 문화적 레퍼런스를 결합해 독특하면서도 웨어러블한 컬렉션을 선보인다.$b$,
 $b$화려한데 과하지 않고, 빈티지한데 낡아 보이지 않는다. 다양한 문화와 시대의 요소를 하나의 옷 안에서 자연스럽게 섞는 능력이 좋다.$b$),

($b$acne-studios$b$, $b$Acne Studios$b$, $b$Sweden$b$, $b$1996$b$, $b$20대 · 30대$b$, $b$Minimal · Street · Avant-garde · Vintage$b$,
 $b$스톡홀름을 기반으로 한 스웨덴 패션 하우스. 스칸디나비아 미니멀리즘을 기반으로 데님, 니트, 테일러링과 아트적인 그래픽을 결합한다.$b$,
 $b$미니멀한 브랜드인데도 지루하지 않다. 컬러나 그래픽, 비율을 한 가지씩 비틀면서 젊은 감각을 유지하는 점이 좋다.$b$),

($b$our-legacy$b$, $b$Our Legacy$b$, $b$Sweden$b$, $b$2005$b$, $b$20대 · 30대$b$, $b$Vintage · Americana · Minimal · Casual$b$,
 $b$스웨덴 기반의 컨템포러리 브랜드. 클래식한 남성복과 빈티지 의류에서 영감을 받아 독특한 원단, 워싱, 패턴과 여유로운 실루엣으로 현대적인 옷장을 구성한다.$b$,
 $b$빈티지와 현대적인 미니멀리즘이 적당히 섞여 있다. 특히 데님과 셔츠, 재킷처럼 기본적인 아이템을 조금 낡은 듯하면서도 세련되게 만드는 방식이 좋다.$b$),

($b$rohe$b$, $b$Róhe$b$, $b$Netherlands$b$, $b$2014$b$, $b$20대 · 30대$b$, $b$Minimal · Luxury · Casual$b$,
 $b$암스테르담을 기반으로 하는 컨템포러리 브랜드. 클래식한 테일러링과 현대적인 비율, 고급 소재를 활용해 절제된 여성복을 만든다.$b$,
 $b$최근 내가 찾는 브랜드들의 중간 지점에 있는 느낌. LEMAIRE나 TOTEME처럼 조용하지만 조금 더 젊고 웨어러블하다.$b$)

on conflict (slug) do nothing;
