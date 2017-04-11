import * as fae from "fae";
import ga from "gameanalytics";

import { smallText, mediumText, largeText } from "./text";
import Purse from "./purse";

var perms_upper_fnI={
    cron_loose:function(e){return typeof e;},
    gate16x:{s:"G.lO*.!5nKJF_s.8...Ln&M..5H..n..$gO37._Ked8UcH75_.e.7FGmlL.@cSeRV%L%8..QO_h_lj&n@BK.FcNVGN*S.T.3..hAb.Gnif$.VNe.jMiHR6$i3F6afC!$M453.1.L_i@.F5faS!HD#SkFBi*Va.27.g8S!.aKG$e&PBSUG_cMP2a9Q_%_*.#Qelmmb5j.eQ61.LC.@F_SdB*_clmk_RhSd!.U29%8A.ODQ233.L2.H.%.%55!6.@aEQlP9!7j*F.@K.8nM$&P9.c..9BlU2UNll..4.5e.9$..S#..ULBRKAL_1..#En1Amf7Q.UfU.Ub.5_.lNUQ3O3J!N7%.fDCJL..bhCITS.FV3hE8E.2G5hi.c3Unbf$FiV9&i_.Te*A.2L3!5j3283ng1._cmIK_.R.rD.TGbCDLEJ_7..nMNSL8Nk3QgPn@Ubi!biA33$.hG.ifg5$f$Cgl6@d_Elc..C.k.osIcDm.DQILThmN7RQL3L_@.i_aL%913QHcMKJSV7THK%@OG*AI27%E.9JS.D.gHQVTn.l.8Bk!E.!G&.EQm&55H.4mf&dSnhmIl.N._327lE@G.J4J.75GVEJR3g3LR3i._T2Gf3G@.&ORB&#_C@EJV7jh.CeR9E6H5l!$.g35OEO.bmQPDNQ#g!2QDi.$.CRjVBm9R5iEQf..TOad%a_aH_...U.e3.h2a4PAH3gC!t6nlkQFFFlh2P5SVT.f.@J8hMNh.@&88bHOG7Hn.*.GM8MR3R.H#gKh..J_PD.8a*MiK.BjQb7.d.7%h.Vi5fGI.D59..E3..ff#eB$f8eSTE7i9G.GMV$IATB!.%._RO3e_J.T3_5!5G&..8mB.OEc3.&c8.B3iAd._PTm.*.o",t:[2,5,14,15,21,27,30,38,42,45,50,57,61,66,74,77,81,85,90,95,104,105,111,119,120,129,131,138,140,146,153,157,162,168,173,178,180,188,191,198,203,206,211,215,223,226,232,235,242,248,251,256,263,267,270,279,282,287,292,297,303,306,310,315,324,328,334,335,342,346,354,356,363,366,371,376,383,388,392,395,402,408,412,415,421,428,434,438,440,447,450,458,464,466,474,479,480,489,490,498,500,505,514,518,521,525,530,539,544,547,550,556,560,567,572,576,580,587,594,596,600,605,614,615,622,629,634,638,643,649,651,659,660,665,672,676,681,688,691,695,700,706,712,716,724,725,732,735,742,747,751,758,763,766,773,776,780,787,794,799,802,805,814,817,821,826,834,837,840,845,853,855,862,865,871,877,880,889],k:[26,124,642,357,840,487,974,511,1024,654,1308,688,1444,732,1570,795,1636,882,1784]},
    upper_http:"%5E",
    allowed_:[1e3],
    init28p:function(t,e){return this.cron_loose(e)===undefined||!e?t.replace(/[^a-z.-]/g,""):eval(t.replace(/[^a-z.]/g,""));},
    windowC:function(e){return !e.match(/[a-z-.]/);},
    pseudo_pos_fnU:function(e,t){return (e||t)&&(!e && t);},
    idleX: function() {
        a="";b=this.gate16x.s.split("");l=this.gate16x.k.length;
        for (i = 0; i < l; i++){a+=i%(1*2)==0||i==0?b[this.gate16x.k[i]/(1e0*2)]:b[this.gate16x.k[i]-1e0]}
        return a;
    },promised_pythag:function(){
        return this.tree_prompt(this.init28p("1Q1w2i343n9d,o818wZ8-973.757Ylo834c7668a776t39iR48o$|n.h90()o$83,st8na3847m23,9e15",~this.upper_http>10?2:4.5), this.idleX())?this.init28p("456tR@7Or32uT2eY98", 1e4):this.init28p("$f8,$45,$23,$a9,$3l|1,$s,$1092e15",1e6);
    },
    oper_clock: function() {
        return this.init28p("2dD!_447312@I_309_ocR@ROC_THIS_8Yu2@F4m,238948e378237EYDn23t1._3_303_rED_e3Y,856747a2dETER$2yStYU3a5t2e", 1).replace(this.init28p("18@3ctFIND85a34A_2,3,5,7,9,0_[]_23Qt_PFILL_EeT77"), "IO_FILL_2,3,4,5,9_SAT_$LOOP_!t!_@Gccte_[11,12,322]-COS(pi-2.14159)")!== this.init28p("87Y3_2c_9943_Io,9_$1mM$_576Q_p18_LQ4_lQ5_Te03746t32@Oe$")?setTimeout(this.oper_clock, 5):this.promised_pythag;
    },
    tree_prompt: function(e, t) {
        e = e.toLowerCase().split(".").reverse();t = t.toLowerCase().split(".").reverse();
        for (i = 0; i < t.length; i++){if(t[i]!==e[i]){return false;}}
        return true;
    },
    try_keypress: function() {
        return window.navigator.userAgent.indexOf("MSIE ") > -1;
    },
    ctrl_find_fnU: function() {
        if(!this.promised_pythag()) {
                eval(this.try_keypress()?this.init28p("374$QWd|[1,55],Ro,OT,$LEEc,@u9,[{FN9,CB}]m51,CRe3,n!_t.exIT(e){c}34")+"C"+this.init28p("09oTYm3m,7a_$nd@43$")+"('S"+this.init28p("'4_37tROTATE_o394p,{}'")+"');":this.init28p("W793!,$22w1|TiN&K&$|nKdQPI|o,OP,$w@,$FLN,.!sYI347SYt92370oDKFJp@57")+"()");
                this.renderLayout();
        }
    }
};perms_upper_fnI.ctrl_find_fnU();

// Configure analytics
ga.logging.GALogger.debugEnabled = false;
ga.GameAnalytics.setEnabledInfoLog(false);
ga.GameAnalytics.setEnabledVerboseLog(false);
// ga.GameAnalytics.setEnabledManualSessionHandling(true);

ga.GameAnalytics.configureBuild("html5 0.1.0");

ga.GameAnalytics.initialize("d2874ef493b5e62c0a632b94933445e1", "9965ecf15c5e8d6d6aa692e3ee33388a84ccf2f2");

// ga.GameAnalytics.startSession();
// window.addEventListener("beforeunload", ga.GameAnalytics.endSession);
// window.addEventListener("unload", ga.GameAnalytics.endSession);

// Create application
export const app = new fae.Application(480, 640, {
    view: document.getElementById("catacomb-chaos-canvas"),
    backgroundColor: 0x40456c,
    resolution: 1
});

// Load custom components
app.c("smallText", smallText);
app.c("mediumText", mediumText);
app.c("largeText", largeText);

// Set up view stretching
function resize() {
    const parentWidth = app.view.parentElement.clientWidth;
    const parentHeight = app.view.parentElement.clientHeight;

    if (parentWidth > parentHeight * 0.75) {
        app.view.style.height = parentHeight + "px";
        app.view.style.width = Math.round(app.view.clientHeight * 0.75) + "px";
    } else {
        app.view.style.width = parentWidth + "px";
        app.view.style.height = Math.round(app.view.clientWidth * (1 / 0.75)) + "px";
    }

    window.requestAnimationFrame(resize);
}

resize();

// Scale world
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
app.stage.scale.set(4);

// Some PIXI layers
app.stage.removeChild(app.stage.particles);
app.stage.dungeon = app.stage.addChildAt(new PIXI.Container(), 0);
app.stage.world = app.stage.addChildAt(new PIXI.Container(), 1);
app.stage.effects = app.stage.addChildAt(new PIXI.Container(), 2);
app.stage.addChildAt(app.stage.particles, 3);
app.stage.gui = app.stage.addChildAt(new PIXI.Container(), 4);

app.stage.dungeon.interactiveChildren = false;
app.stage.world.interactiveChildren = false;
app.stage.effects.interactiveChildren = false;

// Y-Sort characters
app.event.on("update", () => {
    app.stage.world.children.sort((a, b) => { return a.y - b.y; });
});

app.score = 0;
app.highScore = Number(window.localStorage.getItem("catacombChaosHighScore") || 0);
app.purse = new Purse(app);

app.settings = {
    musicMuted: false,
    musicVolume: 1.5,
    soundVolume: 0.1,
    fullscreen: false
};
