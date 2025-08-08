---
category: blog
title: "spesifik bir alan için docker ile osrm kurulumu"
summary: "bu rehber wsl 2'de docker kullanarak osrm kurulumunu anlatır."
guide: true
wip: false
sitemap: false
lang: tr
translations:
  - lang: tr
    url: /blog/docker-ile-osrm-kurulumu/
  - lang: en
    url: /blog/installing-osrm-via-docker/
---

# spesifik bir alan için docker ile osrm kurulumu

bu rehber wsl 2'de docker kullanarak osrm (open source routing machine) kurulumunu anlatır. bu rehberde osrm'i istanbul alanı için yapılandıracağız. osmium-tools kullanarak openstreetmap verilerini istanbul bölgesine polygon sınır dosyası ile kırptıktan sonra bu alan için konfigüre edeceğiz.

## ön gereksinimler

- windows içerisinde kurulu bir wsl v2 (ubuntu 22)
- wsl 2 ile çalışan bir docker kurulmuş olması
- linux ve terminal aşinalığı
- harita veri dosyaları için yeterli disk alanı
- rotalama işlemleri için yeterli bellek (yaklaşık olarak harita dosyası boyutunun 4-5 katı)

## adım 1: gerekli araçları kur

önce wsl 2 ortamınızda osmium-tools'u ve gerekli paketleri kurun:

```bash
sudo apt update
sudo apt install osmium-tool wget curl
```

## adım 2: istanbul polygon sınır dosyası oluştur

istanbul sınırını tanımlayan bir `.poly` dosyası oluşturun. bu dosya coğrafi alanı belirtmek için basit bir polygon formatı kullanır.

`istanbul.poly` adında bir dosya oluşturun:

```bash
mkdir data && cd data
nano istanbul.poly
```

aşağıdaki içeriği ekleyin (yaklaşık istanbul sınırı):

```
polygon
1
   27.8419996589802 41.681380046807476    // Xmin Ymax
   27.8419996589802 40.72975311315034     // Xmin Ymin
   29.992113225541146 40.72975311315034   // Xmax Ymin
   29.992113225541146 41.681380046807476  // Xmax Ymax
   29.992113225541146 41.681380046807476  // Xmax Ymax (polygonu kapatmak için tekrarla)
END
END
```

**not:** veya, çalışma alanı için xmin ymin xmax ymax koordinatlarını almak için [https://boundingbox.klokantech.com/](https://boundingbox.klokantech.com/) kullanabilirsiniz. örnek dosyayı ise [blog/osrm-docker/istanbul.poly](/blog/osrm-docker/istanbul.poly) adresinde bulabilirsiniz.


## adım 3: türkiye openstreetmap verilerini indir

geofabrik'ten openstreetmap türkiye verilerini indiriyoruz:

```bash
wget https://download.geofabrik.de/europe/turkey-latest.osm.pbf
```

## adım 4: osmium kullanarak istanbul alanını çıkar

osmium-tool kullanarak türkiye verilerini sadece istanbul alanına kırpıyoruz:

```bash
osmium extract -p istanbul.poly turkey-latest.osm.pbf -o istanbul.osm.pbf
```

pbf dosyasını kırparak, sadece istanbul alanını içeren çok daha küçük bir `istanbul.osm.pbf` elde etmekle kalmaz, aynı zamanda routing makinesinin ihtiyaç duyduğu bellek miktarını da önemli ölçüde azaltırız.

## adım 5: docker ile osrm kurulumu

şimdi istanbul verilerini docker konteynerleri kullanarak osrm ile işleyeceğiz.

### yol ağını çıkar

istanbul verilerini araç profili ile ön işleme tabi tutalım:

```bash
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/istanbul.osm.pbf || echo "çıkarma işlemi başarısız"
```

`-v "${PWD}:/data"` bayrağı docker konteynerinin içinde `/data` dizinini oluşturur ve mevcut çalışma dizinini `${pwd}` orada kullanılabilir hale getirir. bu işlem verilerinizin boyutuna bağlı olarak biraz zaman alabilir.

### bölümleme ve özelleştirme

bölümleme ve özelleştirme adımlarını çalıştırıyoruz:

```bash
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/istanbul.osrm || echo "bölümleme işlemi başarısız"
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/istanbul.osrm || echo "özelleştirme işlemi başarısız"
```

**not:** tek bir `istanbul.osrm` dosyası yoktur, ancak birden fazla `istanbul.osrm.*` dosyası vardır. `istanbul.osrm` bir dosya yolu değil, bir dizi dosyaya atıfta bulunan bir "temel" yoldur.

#### bölümleme işlemi

osrm'deki bölümleme işlemi, harita verilerini daha küçük, daha yönetilebilir parçalara bölerek rotalama motorunun verimliliğini artıran temel bir adımdır. bölümleme algoritmasının birincil amacı, harita verileriyle temsil edilen grafiği \( k \) eşit boyutlu köşe alt kümesine bölmektir. bu, her iki uç noktası da aynı alt küme içinde olan yerel kenarların sayısını maksimize ederek gerçekleştirilir.

graf teorisi açısından, \( G = (V, E) \) yönlendirilmemiş bir graf verildiğinde, burada \( V \) köşeler kümesi ve \( E \) kenarlar kümesidir, amaç \( V \)'yi \( k \) alt kümesine bölmektir, öyle ki her iki uç noktası da aynı alt kümede olan kenarların sayısı maksimize edilir. bu strateji, arama alanını ilgili bölümle sınırlayarak rotalama sorgularının karmaşıklığını azaltır, böylece osrm'in en kısa yol hesaplamaları için kullandığı dijkstra algoritmasının performansını artırır. algoritmanın verimliliği özellikle çalışma süresini azaltmasında belirgindir, bu süre kenarların ve köşelerin sayısının toplamıyla orantılıdır: $ \Theta(&#124;E&#124; + &#124;V&#124;\log&#124;V&#124;) $.

birden fazla bölümü kapsayan rotalama sorguları için osrm, grafikteki kısayolları önceden hesaplayarak en kısa yol hesaplamasını daha da hızlandıran gelişmiş bir teknik olan contraction hierarchies kullanır. bölümleme ve contraction hierarchies'in bu ikili yaklaşımı, osrm'in büyük ölçekli rotalama sorgularını yüksek verimlilik ve hızla işleyebilmesini sağlar.

### routing sunucusunu başlatılması

osrm http sunucusunu 5000 portunda başlatıyoruz:

```bash
docker run -t -i -p 5000:5000 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/istanbul.osrm
```

## adım 6: kurulumun test edilmesi
istanbul'da rotalama sorgusunu test etmek için http sunucusuna curl aracılığıyla farklı bir terminalden istek gönderiyoruz:

```bash
curl "http://localhost:5000/route/v1/driving/29.0136,41.0053;28.9784,41.0082?steps=false"
```

şuna benzer bir şey döndürecektir:

```json
{"code":"Ok","routes":[{"legs":[{"steps":[],"weight":1097.9,"summary":"","duration":1097.9,"distance":13785.3}],"weight_name":"routability","geometry":"{zgyF{vapDnQ}^kDyShR_GqMuZNsAnH_FoC{LlCuGcN}IcAlCaCeB_AxEd@jAqIzz@hGvo@sEflAWp]nBfTtV|bB`A`[QlJeFpYeA|c@{CjYGfOx@rIs@vAkPHqIkENw[_CU^sJlDaPzMdDnDgUeCeQsBfC}@MwE{RbG{F`DaHfBSbCaDi@mHaGkGbBsC{GaJq@dApA~AqC`F_BmB","weight":1097.9,"duration":1097.9,"distance":13785.3}],"waypoints":[{"hint":"zUZTgf___38XAAAATwAAAGsAAACaAAAAzfLUQbEqdEL0yutCNForQxcAAABPAAAAawAAAJoAAAClFAEA6ba6AWmxcQJgtroB9LBxAgQAPwgAAAAA","location":[29.013737,41.005417],"name":"Burhan Felek Caddesi","distance":17.36628242},{"hint":"9DUegBktqYAGAAAAXAAAAAAAAABqAAAAKfGYQF3DfEIAAAAA19iSQgYAAABcAAAAAAAAAGoAAAClFAEA-zG6AdC4cQLgLLoBSLxxAgAArwIAAAAA","location":[28.979707,41.007312],"name":"Bab-I Hümayun Caddesi","distance":147.6762278}]}
```

### örnek api uç noktaları

- **rota hesaplama:** bu uç nokta belirtilen koordinatlar arasında verilen profil kullanarak optimal rotayı hesaplar. erişmek için `GET /route/v1/{profile}/{coordinates}` kullanın.
- **en yakın yol:** bu uç nokta verilen koordinata en yakın yolu bulur. `GET /nearest/v1/{profile}/{coordinate}` ile erişin.
- **mesafe matrisi:** bu uç nokta birden fazla koordinat arasında mesafe ve süre matrisi sağlar. `GET /table/v1/{profile}/{coordinates}` ile erişilebilir.

## her başlangıçta yol ağını güncelleme

osrm örneğinizi en son yol ağı ile güncel tutmak için, her osrm başlattığınızda güncelleme sürecini otomatikleştirebilirsiniz. bu, en yeni osm verisini indirmeyi, işlemeyi ve ardından routing sunucusunu başlatmayı içerir.

### bash yaklaşımı

bu adımları gerçekleştiren basit bir bash scripti:

```bash
#!/bin/bash
set -e
cd data
 
# eski veri dosyalarını kaldır ve türkiye için günceli indir
rm -f turkey-latest.osm.pbf istanbul.osm.pbf istanbul.osrm*
wget -q https://download.geofabrik.de/europe/turkey-latest.osm.pbf
osmium extract -p istanbul.poly turkey-latest.osm.pbf -o istanbul.osm.pbf

# osrm ile işle
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/istanbul.osm.pbf
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/istanbul.osrm
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/istanbul.osrm

# sunucuyu başlat
docker run -t -i -p 5000:5000 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/istanbul.osrm
```

### docker compose yaklaşımı

daha basit, otomatik bir çözüm için docker compose kullanarak her şeyi tek komutla halledebiliriz. proje dizininizde bir `docker-compose.yml` dosyası oluşturmak yeterli olacaktır. tam yapılandırmayı [blog/osrm-docker/docker-compose.yml](/blog/osrm-docker/docker-compose.yml) adresinde bulabilirsiniz.

#### kullanım

```bash
# her şeyi başlat
docker compose up

# arka planda çalıştır
docker compose up -d

# logları görüntüle
docker compose logs -f

# her şeyi durdur
docker compose down
```

#### ne yapar

- en güncel harita verilerini otomatik olarak indirir
- sadece istanbul alanını çıkarır
- routing için verileri işler
- 5000 portunda routing sunucusunu başlatır

bu, her başlattığınızda taze verilerle güncellenen tamamen otomatik bir osrm kurulumu elde etmenin en kolay yoludur.

## routing profilleri

`-p` parametresini değiştirerek farklı routing profilleri kullanabilirsiniz:

- **araba:** `/opt/car.lua`
- **bisiklet:** `/opt/bicycle.lua`
- **yaya:** `/opt/foot.lua`

### özel profil

belirli ihtiyaçlara uygun routing davranışlarını değiştirmek için özel bir osrm profili oluşturabilirsiniz. işte kısa bir genel bakış:

1. **profil yapısı**: yolların nasıl işleneceğini tanımlayan, hız ve ceza ayarları ile düğümler, yollar ve dönüşler dahil bir lua scripti.

2. **temel bileşenler**:
   - **setup**: maksimum hız, dönüş cezaları ve tercihleri yapılandırır.
   - **process node**: trafik ışıkları gibi düğüm özelliklerini işler.
   - **process way**: yol segmentleri için hız ve erişim kurallarını belirler.
   - **process turn**: dönüş kısıtlamalarını ve cezalarını yönetir.

3. **örnek profil**:
   - **hızlar**: farklı yol türlerine sabit hızlar atayın.
   - **cezalar**: trafik sinyalleri ve u dönüşleri için cezalar belirleyin.
   - **dışlamalar**: routing'den çıkarılacak yol sınıflarını tanımlayın.

4. **uygulama**:
   - scripti `.lua` dosyası olarak kaydedin.
   - `osrm-extract` ve `osrm-contract` ile kullanın.
   - osrm'i özel profilinizle başlatın.

özel profiller, belirli araç türleri veya test senaryoları için optimize edilmiş routing'e izin verir.

[örnek profil](https://github.com/Project-OSRM/osrm-backend/blob/master/profiles/testbot.lua)

## referanslar

afi.io. (t.y.). *introduction to osrm: setting up osrm backend using docker*. [https://www.afi.io/blog/introduction-to-osrm-setting-up-osrm-backend-using-docker](https://www.afi.io/blog/introduction-to-osrm-setting-up-osrm-backend-using-docker) adresinden alınmıştır. son erişim: 31.07.2025

project osrm. (t.y.). *osrm backend github repository*. github. [https://github.com/project-osrm/osrm-backend](https://github.com/project-osrm/osrm-backend) adresinden alınmıştır. son erişim: 31.07.2025