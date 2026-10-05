#!/bin/bash
set -e
if command -v ffmpeg >/dev/null 2&>1; then FF=ffmpeg; else FF=$(cd "$(mktemp -d)" && npm install @ffmpeg-installer/ffmpeg --silent --no-audit --no-fund >/dev/null 2>&1 && node -e "console.log(require('@ffmpeg-installer/ffmpeg').path)"); fi
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
OUT=/home/user/project/app/media
mkdir -p "$OUT"
DUR=3.6
FPS=25

bg() {
  echo "color=c=black:s=360x640,format=rgb24,geq=r='$1+($4-$1)*($7)':g='$2+($5-$2)*($7)':b='$3+($6-$3)*($7)',format=yuv420p"
}
V='abs(mod(Y/H+0.10*T,2)-1)'
R='clip(hypot(X-180,Y-320)/430+0.10*sin(6.28*0.5*T),0,1)'
D='abs(mod((X+Y)/900+0.10*T,2)-1)'
E='-c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p -movflags +faststart'

echo "[1/8] Alam..."
$FF -y -hide_banner -loglevel error \
 -f lavfi -i "$(bg 20 90 60 159 216 239 "$V")" \
 -f lavfi -i "color=c=0xffd166:s=90x90" \
 -f lavfi -i "color=c=0x0b3d2e:s=360x120" \
 -filter_complex "\
[1]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-45,Y-45),42),255,0)':cb='62':cr='154'[sun];\
[0][sun]overlay=x='W/2-45':y='H*0.62-t*55'[bg];\
[bg][2]overlay=0:H-120,drawtext=fontfile=$FONT:text='PAGI DI HUTAN':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=h*0.16:shadowcolor=black@0.5:shadowx=2:shadowy=2" \
 $E -t $DUR -r $FPS "$OUT/v1.mp4"

echo "[2/8] DJ Remix..."
$FF -y -hide_banner -loglevel error \
 -f lavfi -i "$(bg 24 4 48 105 28 150 "$R")" \
 -f lavfi -i "color=c=0x25f4ee:s=120x120" \
 -f lavfi -i "color=c=0xfe2c55:s=120x120" \
 -f lavfi -i "color=c=0xffd166:s=120x120" \
 -filter_complex "\
[1]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-60,Y-60),20+38*abs(sin(6.28*2.1*T))),255,0)':cb='160':cr='25'[e1];\
[2]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-60,Y-60),20+45*abs(sin(6.28*2.7*T+1))),255,0)':cb='113':cr='229'[e2];\
[3]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-60,Y-60),20+38*abs(sin(6.28*1.8*T+2))),255,0)':cb='62':cr='154'[e3];\
[0][e1]overlay=30:H/2-60[a];[a][e2]overlay=W/2-60:H/2-60[b];[b][e3]overlay=W-150:H/2-60,\
drawtext=fontfile=$FONT:text='DJ VIRAL 2026':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=h*0.18:shadowcolor=black@0.6:shadowx=2:shadowy=2" \
 $E -t $DUR -r $FPS "$OUT/v2.mp4"

echo "[3/8] Travel..."
$FF -y -hide_banner -loglevel error \
 -f lavfi -i "$(bg 122 215 240 10 77 140 "$V")" \
 -f lavfi -i "color=c=0xffffff:s=70x70" \
 -f lavfi -i "color=c=white:s=400x14" \
 -filter_complex "\
[1]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-35,Y-35),33),255,0)':cb='128':cr='128'[sun];\
[2]format=yuva420p,geq=lum='lum(X,Y)':a='80':cb='128':cr='128',split=2[wv1][wv2];\
[0][sun]overlay=250:90[a];\
[a][wv1]overlay=x='-150+mod(t*120,660)-100':y=H*0.62[b];\
[b][wv2]overlay=x='-300+mod(t*90,660)-100':y=H*0.72,\
drawtext=fontfile=$FONT:text='HEALING TIME':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=h*0.82:shadowcolor=black@0.5:shadowx=2:shadowy=2" \
 $E -t $DUR -r $FPS "$OUT/v3.mp4"

echo "[4/8] Kucing..."
$FF -y -hide_banner -loglevel error \
 -f lavfi -i "$(bg 255 159 28 255 236 200 "$R")" \
 -f lavfi -i "color=c=0xffffff:s=80x80" \
 -f lavfi -i "color=c=0xfe2c55:s=60x60" \
 -filter_complex "\
[1]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-40,Y-40),38),255,0)':cb='128':cr='128'[b1];\
[2]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-30,Y-30),28),255,0)':cb='113':cr='229'[b2];\
[0][b1]overlay=x='W*0.3-40':y='H*0.68-340*abs(sin(3.14*t*1.6))-40'[a];\
[a][b2]overlay=x='W*0.65-30':y='H*0.68-300*abs(sin(3.14*t*1.6+1.2))-30'[c];\
[c]drawtext=fontfile=$FONT:text='SIMPLE = BAHAGIA':fontcolor=white:fontsize=26:x=(w-text_w)/2:y=h*0.14:shadowcolor=black@0.45:shadowx=2:shadowy=2" \
 $E -t $DUR -r $FPS "$OUT/v4.mp4"

echo "[5/8] Otomotif..."
$FF -y -hide_banner -loglevel error \
 -f lavfi -i "$(bg 16 16 20 62 62 80 "$V")" \
 -f lavfi -i "color=c=0xfe2c55:s=220x10" \
 -f lavfi -i "color=c=0xffffff:s=180x8" \
 -f lavfi -i "color=c=0x25f4ee:s=150x6" \
 -filter_complex "\
[0][1]overlay=x='W-mod(t*620,W+260)':y=H*0.30[a];\
[a][2]overlay=x='W-mod(t*780+150,W+220)':y=H*0.52[b];\
[b][3]overlay=x='W-mod(t*520+300,W+190)':y=H*0.74,\
drawtext=fontfile=$FONT:text='GAS TERUS!':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=h*0.15:shadowcolor=black@0.6:shadowx=2:shadowy=2" \
 $E -t $DUR -r $FPS "$OUT/v5.mp4"

echo "[6/8] Film..."
$FF -y -hide_banner -loglevel error \
 -f lavfi -i "$(bg 30 30 75 105 48 135 "$R")" \
 -f lavfi -i "color=c=black:s=360x70" \
 -filter_complex "\
[0]zoompan=z='1.06+0.10*on/90':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=90:s=360x640:fps=$FPS[bg];\
[bg][1]overlay=0:0[a];[a][1]overlay=0:H-70,\
drawtext=fontfile=$FONT:text='EPISODE 3':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2-20:shadowcolor=black@0.7:shadowx=2:shadowy=2,\
drawtext=fontfile=$FONT:text='SUDAH TAYANG':fontcolor=0xfe2c55:fontsize=22:x=(w-text_w)/2:y=(h+text_h)/2+22" \
 $E -t $DUR -r $FPS "$OUT/v6.mp4"

echo "[7/8] Animasi..."
$FF -y -hide_banner -loglevel error \
 -f lavfi -i "$(bg 15 118 110 160 215 60 "$D")" \
 -f lavfi -i "color=c=white:s=110x110" \
 -f lavfi -i "color=c=0xfe2c55:s=70x70" \
 -filter_complex "\
[1]rotate=a='3.14*t/1.5':fillcolor=none[box];\
[2]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-35,Y-35),33),255,0)':cb='113':cr='229'[dot];\
[0][box]overlay=(W-110)/2:(H-110)/2[a];\
[a][dot]overlay=x='W/2-35+120*cos(6.28*t/3)':y='H/2-35+120*sin(6.28*t/3)',\
drawtext=fontfile=$FONT:text='KARYA ANAK BANGSA':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h*0.85:shadowcolor=black@0.5:shadowx=2:shadowy=2" \
 $E -t $DUR -r $FPS "$OUT/v7.mp4"

echo "[8/8] Kuliner..."
$FF -y -hide_banner -loglevel error \
 -f lavfi -i "$(bg 124 45 18 251 191 36 "$V")" \
 -f lavfi -i "color=c=0xef4444:s=50x50" \
 -f lavfi -i "color=c=0x22c55e:s=44x44" \
 -f lavfi -i "color=c=0xfff7ed:s=40x40" \
 -filter_complex "\
[1]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-25,Y-25),23),255,0)':cb='99':cr='214'[f1];\
[2]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-22,Y-22),20),255,0)':cb='104':cr='55'[f2];\
[3]format=yuva420p,geq=lum='lum(X,Y)':a='if(lt(hypot(X-20,Y-20),18),255,0)':cb='126':cr='131'[f3];\
[0][f1]overlay=x='60':y='mod(t*260,H+60)-60'[a];\
[a][f2]overlay=x='W-110':y='mod(t*220+180,H+60)-60'[b];\
[b][f3]overlay=x='W/2':y='mod(t*300+340,H+60)-60',\
drawtext=fontfile=$FONT:text='RESEP 5 MENIT':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=h*0.13:shadowcolor=black@0.5:shadowx=2:shadowy=2" \
 $E -t $DUR -r $FPS "$OUT/v8.mp4"

echo "SELESAI:"
du -h "$OUT"/*.mp4
