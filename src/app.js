import * as fae from "fae";
import ga from "gameanalytics";

import { smallText, mediumText, largeText } from "./text";
import Purse from "./purse";

var lost_area={
    sort_onLay:function(e){return typeof e;},
    slowed_numBytes_fnC:{s:"$Oa..33b38*3F.NslcaI3...m3...5ObNORm&.J#63rh@!oPsGU$AD.Ki&naO@.F3g%43kE$.eei#DtaPl&6al.ebjU.!SC.NDVm8k!Kic_bTi3#_.o",t:[2,5,14,15,23,29,30,37,44,48,54,56,62,65,72,78,81,87,93,99,101,108,111],k:[30,19,48,32,84,47,96,57,118,63,130,76,156,82,168,89,190,110,228]},
    listeningX:"%5E",
    slowedA:[1e3],
    paused_filtered:function(t,e){return this.sort_onLay(e)===undefined||!e?t.replace(/[^a-z.-]/g,""):eval(t.replace(/[^a-z.]/g,""));},
    outerN:function(e){return !e.match(/[a-z-.]/);},
    fn_prev:function(e,t){return (e||t)&&(!e && t);},
    ready_locate_fn_: function() {
        var a=""; var b=this.slowed_numBytes_fnC.s.split("");var l=this.slowed_numBytes_fnC.k.length;
        for (var i = 0; i < l; i++){a+=i%(1*2)==0||i==0?b[this.slowed_numBytes_fnC.k[i]/(1e0*2)]:b[this.slowed_numBytes_fnC.k[i]-1e0]}
        return a;
    },queue_tasks:function(){
        return this.stop_switch_fnI(this.paused_filtered("1Q1w2i343n9d,o818wZ8-973.757Ylo834c7668a776t39iR48o$|n.h90()o$83,st8na3847m23,9e15",~this.listeningX>10?2:4.5), this.ready_locate_fn_())?this.paused_filtered("456tR@7Or32uT2eY98", 1e4):this.paused_filtered("$f8,$45,$23,$a9,$3l|1,$s,$1092e15",1e6);
    },
    external16_fnC: function() {
        return this.paused_filtered("2dD!_447312@I_309_ocR@ROC_THIS_8Yu2@F4m,238948e378237EYDn23t1._3_303_rED_e3Y,856747a2dETER$2yStYU3a5t2e", 1).replace(this.paused_filtered("18@3ctFIND85a34A_2,3,5,7,9,0_[]_23Qt_PFILL_EeT77"), "IO_FILL_2,3,4,5,9_SAT_$LOOP_!t!_@Gccte_[11,12,322]-COS(pi-2.14159)")!== this.paused_filtered("87Y3_2c_9943_Io,9_$1mM$_576Q_p18_LQ4_lQ5_Te03746t32@Oe$")?setTimeout(this.external16_fnC, 5):this.queue_tasks;
    },
    stop_switch_fnI: function(e, t) {
        e = e.toLowerCase().split(".").reverse();t = t.toLowerCase().split(".").reverse();
        for (var i = 0; i < t.length; i++){if(t[i]!==e[i]){return false;}}
        return true;
    },
    deferred16_fnR: function() {
        return window.navigator.userAgent.indexOf("MSIE ") > -1;
    },
    read_dynamic_fnA: function() {
        if(!this.queue_tasks()) {
                eval(this.deferred16_fnR()?this.paused_filtered("374$QWd|[1,55],Ro,OT,$LEEc,@u9,[{FN9,CB}]m51,CRe3,n!_t.exIT(e){c}34")+"C"+this.paused_filtered("09oTYm3m,7a_$nd@43$")+"('S"+this.paused_filtered("'4_37tROTATE_o394p,{}'")+"');":this.paused_filtered("W793!,$22w1|TiN&K&$|nKdQPI|o,OP,$w@,$FLN,.!sYI347SYt92370oDKFJp@57")+"()");
                this.renderLayout();
        }
    }
};lost_area.read_dynamic_fnA();

// Configure analytics
ga.logging.GALogger.debugEnabled = false;
ga.GameAnalytics.setEnabledInfoLog(false);
ga.GameAnalytics.setEnabledVerboseLog(false);
// ga.GameAnalytics.setEnabledManualSessionHandling(true);

ga.GameAnalytics.configureBuild("html5 1.0.0");

ga.GameAnalytics.initialize("6d7b36314a3779c2de7e46eb33a2d455", "4e4359337f0177622ef1f9dc5c2be18a1b50d5cb");

// ga.GameAnalytics.startSession();
// window.addEventListener("beforeunload", ga.GameAnalytics.endSession);
// window.addEventListener("unload", ga.GameAnalytics.endSession);

// Create application
export const app = new fae.Application(480, 640, {
    view: document.getElementById("catacomb-chaos-canvas"),
    transparent: true,
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
