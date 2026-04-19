const catUrls =
[
    "Resources/Imgs/Cat_imgs/637504925_1335737565027348_2711308338909549589_n.jpg",
    "Resources/Imgs/Cat_imgs/660767968_917762301081010_9115556837267146554_n.jpg",
    "Resources/Imgs/Cat_imgs/664289471_1269822081362012_8331023428841532884_n.jpg",
    "Resources/Imgs/Cat_imgs/664314779_4295383360710403_6088586368347165983_n.jpg",
    "Resources/Imgs/Cat_imgs/664407134_1566596684441549_5811764716995801580_n.jpg",
    "Resources/Imgs/Cat_imgs/664736669_1256136733401406_7196935068568418556_n.jpg",
    "Resources/Imgs/Cat_imgs/668725798_1924485681519500_3053834524083633537_n.jpg",
    "Resources/Imgs/Cat_imgs/674355909_3663844083757492_1608850253477360552_n.jpg",
    "Resources/Imgs/Cat_imgs/674289537_2489377444853863_8398338929150350460_n.jpg",
    "Resources/Imgs/Cat_imgs/674282111_1544716550592483_7888726547957021478_n.jpg",
    "Resources/Imgs/Cat_imgs/672058427_1512018353848697_1784022992676750907_n.jpg",
    "Resources/Imgs/Cat_imgs/671917859_2077870696436880_3634519222949420882_n.jpg",
    "Resources/Imgs/Cat_imgs/671482879_2066345033959054_1830653845744358347_n.jpg",
    "Resources/Imgs/Cat_imgs/672246585_1490957996012889_5473808342241986718_n.jpg",
    "Resources/Imgs/Cat_imgs/672698888_971797435310351_3830883337602556168_n.jpg",
    "Resources/Imgs/Cat_imgs/674269607_977601484735101_6987560780554890258_n.jpg",
    "Resources/Imgs/Cat_imgs/676611456_1457976455344828_2842205839786196458_n.jpg",
    "Resources/Imgs/Cat_imgs/670949033_1944228476185719_1861560299095997069_n.jpg",
    "Resources/Imgs/Cat_imgs/670498323_838273165981259_6238886998631735477_n.jpg",
    "Resources/Imgs/Cat_imgs/668697765_1619328522682189_7460610787278644291_n.jpg",
    "Resources/Imgs/Cat_imgs/670815812_2776012699450960_351813636283348826_n.jpg",
    "Resources/Imgs/Cat_imgs/673648097_1137751025158707_2384731684045986050_n.jpg",
    "Resources/Imgs/Cat_imgs/674269607_977601484735101_6987560780554890258_n.jpg",
    "Resources/Imgs/Cat_imgs/672151500_971211542103187_6015264400719865680_n.jpg"
]

const bgUrls =[
    "Resources/Imgs/Bg_imgs/7sUvju2B.jpg",
    "Resources/Imgs/Bg_imgs/ciooWP2n.jpg",
    "Resources/Imgs/Bg_imgs/gfbKm-XN.jpg",
    "Resources/Imgs/Bg_imgs/Hs_JMe0S.jpg",
    "Resources/Imgs/Bg_imgs/leWuoHQD.jpg",
    "Resources/Imgs/Bg_imgs/oF6wHfan.jpg",
    "Resources/Imgs/Bg_imgs/rzJbTJKy.jpg",
    "Resources/Imgs/Bg_imgs/vLr7IfSE.jpg"
];

const monthyPythonGif = "Resources/Imgs/The_Bridge_of_Death_Monty_Python_and_the_Holy_Grail.gif"

function getRandomCatPic(){

    shuffle(catUrls);
     const index = Math.floor(Math.random() * catUrls.length);
    return catUrls[index];
}
function randomBackground() {
    shuffle(bgUrls);
    const index = Math.floor(Math.random() * bgUrls.length);
    return bgUrls[index];
}