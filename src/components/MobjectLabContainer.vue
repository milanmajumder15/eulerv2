<template>
  <MobjectLab
    v-bind:animating="animating"
    v-bind:animation-header-style="animationHeaderStyle"
    v-bind:animation-index="animationIndex"
    v-bind:animation-is-valid="animationIsValid"
    v-bind:animation-offset="animationOffset"
    v-bind:animations="animations"
    v-bind:chosen-scene-prop="chosenScene"
    v-bind:chosen-scene="chosenScene"
    v-bind:code="code"
    v-bind:current-animation-diff="currentAnimationDiff"
    v-bind:current-animation="currentAnimation"
    v-bind:current-scene-diff="currentSceneDiff"
    v-bind:debug="debug"
    v-bind:display-code="displayCode"
    v-bind:expanded-panel-prop="expandedPanel"
    v-bind:mobject-choices="mobjectChoices"
    v-bind:mobjects="mobjects"
    v-bind:prior-scene="priorScene"
    v-bind:release-notes-dialog-prop="releaseNotesDialog"
    v-bind:release-notes="releaseNotes"
    v-bind:scene-before-animation="sceneBeforeAnimation"
    v-bind:scene-choices="sceneChoices"
    v-bind:scene-header-style="sceneHeaderStyle"
    v-bind:scene-is-valid="sceneIsValid"
    v-bind:scene-loaded="sceneLoaded"
    v-bind:scene="scene"
    v-on:chosen-scene-update="(val)=>{chosenScene=val}"
    v-on:code-change="toggleCode"
    v-on:debug-toggle="debug = !debug"
    v-on:expanded-panel-update="(val)=>{expandedPanel=val}"
    v-on:handle-arg-change="handleArgChange"
    v-on:handle-mobject-update="handleMobjectUpdate"
    v-on:handle-new-animation="handleNewAnimation"
    v-on:jump-to-animation-end="jumpToAnimationEnd"
    v-on:jump-to-animation-start="jumpToAnimationStart"
    v-on:new-mobject="newMobject"
    v-on:pause="pause"
    v-on:play="play"
    v-on:release-notes-dialog-update="(val)=>{releaseNotesDialog=val}"
    v-on:replay="replay"
    v-on:run-manim="runManim"
    v-on:step-backward="stepBackward"
    v-on:step-forward="stepForward"
    v-on:update-code="updateCode"
    v-on:update-setup="updateSetup"
  />
</template>

<script>
import * as _ from "lodash";
import * as consts from "../constants.js";
import * as Manim from "../manim.js";
import * as utils from "../utils.js";
import chroma from "chroma-js";

import MobjectLab from './MobjectLab.vue'

export default {
  name: "MobjectLabContainer",
  components: {
    MobjectLab,
  },
  computed: {
    currentAnimation() {
      return this.animations[this.animationIndex];
    },
    animating() {
      return this.animationOffset !== 0 && this.animationOffset !== 1;
    },
    sceneHeaderStyle() {
      let ret = {};
      if (!this.sceneIsValid) {
        ret["color"] = "red";
      }
      return ret;
    },
    animationHeaderStyle() {
      let ret = {};
      if (this.sceneIsValid && !this.animationIsValid) {
        ret["color"] = "red";
      }
      return ret;
    },
    sceneIsValid() {
      return this.diffIsValidForScene(this.currentSceneDiff, this.priorScene);
    },
    animationIsValid() {
      return this.diffIsValidForScene(this.currentAnimationDiff, this.sceneBeforeAnimation);
    },
    sceneBeforeAnimation() {
      // TODO: use utils.updateSceneWithDiff
      let ret = this.priorScene;
      ret = _.concat(ret, this.currentSceneDiff.add || []);
      ret = _.difference(ret, this.currentSceneDiff.remove || []);
      return ret;
    },
  },
  data() {
    return {
      priorScene: [],
      currentSceneDiff: {},
      currentAnimationDiff: {},
      expandedPanel: [1],
      releaseNotes: consts.RELEASE_NOTES,
      releaseNotesDialog: false,
      debug: true,
      code: consts.EXAMPLE_CODE,
      displayCode: true,
      playingSingleAnimation: null,
      sceneChoices: [],
      chosenScene: "SquareToCircle",
      scene: null,
      sceneLoaded: false,
      mobjectChoices: [
        "Circle",
        "Square",
        "Triangle",
        "Pentagon",
        "Star",
        "Hexagon",
        "StarOfDavid",
        "Octagon"
      ],
      animationIndex: 0,
      animationOffset: 0,
      animations: [
        {
          className: "ReplacementTransform",
          description: "Morph one Mobject into another",
          args: ["mobject1", "mobject2"],
          argDescriptions: ["Start Mobject", "End Mobject"],
          durationSeconds: 1,
          animation: null
        }
      ],
      setupDiffs: [
        // diffs are of the form:
        // {
        //   'add':    [mobject11, ...],
        //   'remove': [mobject21, ...],
        //   'modify': [[mobject31, forwardFunc, backwardFunc], ...],
        // }
        { add: ["mobject1"] }
      ],
      mobjects: {},
      initialMobjects: {
        mobject1: {
          className: "Circle",
          params: {},
          position: [-1, 0],
          style: {
            strokeColor: "#fc6255ff",
            fillColor: "#00000000",
            strokeWidth: 4
          },
          mobject: null
        },
        mobject2: {
          className: "Square",
          params: {},
          position: [1, 0],
          style: {
            strokeColor: "#ffffffff",
            fillColor: "#00000000",
            strokeWidth: 4
          },
          mobject: null
        },
        mobject3: {
          className: "Square",
          params: {},
          position: [1, 0],
          style: {
            strokeColor: "#00ff00ff",
            fillColor: "#00000000",
            strokeWidth: 4
          },
          mobject: null
        }
      }
    };
  },
  mounted() {
    this.scene = new Manim.Scene({ width: 640, height: 360 });
    this.scene.appendTo(document.getElementById("manim-background"));
    this.scene.update();
    this.scene.renderer.domElement.id = "manim-scene";
    window.languagePluginLoader.then(() => {
      window.pyodide.loadPackage("manimlib").then(() => {
        window.pyodide.runPython("import manimlib");
        window.pyodide.runPython("import numpy");
        window.manimlib = window.pyodide.pyimport("manimlib");
        for (let mobjectName of Object.keys(this.initialMobjects)) {
          let data = _.cloneDeep(this.initialMobjects[mobjectName]);
          this.setMobjectField(data);
          this.$set(this.mobjects, mobjectName, data);
        }
        this.currentAnimation.animation = this.buildCurrentAnimation();
        this.currentSceneDiff = this.setupDiffs[0];
        this.currentAnimationDiff = Manim[this.currentAnimation.className].getDiff(
          ...this.currentAnimation.args
        );
        this.applyDiff(
          this.currentSceneDiff,
          /*reverse=*/ false,
          /*moveCursor=*/ false
        );
        this.refreshSceneChoices();
        this.sceneLoaded = true;
      });
    });
  },
  methods: {
    runManim: function() {
      let scene = window.manimlib.get_scene(this.code, [this.chosenScene]);
      scene.render();

      // Create a mapping from ids to human-readable names
      let mobjectIdsToNames = {};
      let mobjectIds = Object.keys(scene.mobject_dict);
      for (let i = 0; i < mobjectIds.length; i++) {
        let id = mobjectIds[i];
        let mobjectData = scene.mobject_dict[id];
        if (!utils.isGroupData(mobjectData)) {
          mobjectIdsToNames[id] = "mobject" + (i + 1);
        } else {
          mobjectIdsToNames[id] = "group" + (i + 1);
        }
      }

      // Assign human-readble names to the entries of the scene list
      scene.scene_list = scene.scene_list.map(idList =>
        idList.map(id => mobjectIdsToNames[id])
      );

      // Assign human-readable names to the arguments in the animation list
      let newAnimationList = _.cloneDeep(scene.render_list);
      for (let i = 0; i < scene.render_list.length; i++) {
        if ("args" in scene.render_list[i]) {
          newAnimationList[i].args = scene.render_list[i].args.map(
            id => mobjectIdsToNames[id]
          );
        }
      }

      // Create initial Mobject data
      let newMobjects = {};
      for (let id of Object.keys(scene.mobject_dict)) {
        let mobjectData = scene.mobject_dict[id];
        if (!utils.isGroupData(mobjectData)) {
          // TODO: Mobjects with top-level points can still function as Groups
          let strokeColor = mobjectData.style.strokeColor;
          let strokeOpacity = mobjectData.style.strokeOpacity;
          mobjectData.style.strokeColor = chroma(strokeColor)
            .alpha(strokeOpacity)
            .hex();
          delete mobjectData.style.strokeOpacity;

          let fillColor = mobjectData.style.fillColor;
          let fillOpacity = mobjectData.style.fillOpacity;
          mobjectData.style.fillColor = chroma(fillColor)
            .alpha(fillOpacity)
            .hex();
          delete mobjectData.style.fillOpacity;
        } else {
          let newSumbojects = mobjectData.submobjects.map(
            id => mobjectIdsToNames[id]
          );
          mobjectData.submobjects = newSumbojects;
        }
        newMobjects[mobjectIdsToNames[id]] = mobjectData;
      }

      // Create Scene Diffs
      let newSceneDiffs = [];
      let sceneAfterLastAnimation = [];
      for (let i = 0; i < scene.scene_list.length; i++) {
        newSceneDiffs.push(
          utils.getDiffFromTwoScenes(
            sceneAfterLastAnimation,
            scene.scene_list[i],
            newMobjects,
          )
        );

        sceneAfterLastAnimation = utils.updateSceneWithDiff(
          scene.scene_list[i],
          Manim[scene.render_list[i].className].getDiff(
            ...scene.render_list[i].args.map(id => mobjectIdsToNames[id])
          ),
          newMobjects,
        );
      }

      this.mobjects = newMobjects;
      this.animations = newAnimationList;
      this.setupDiffs = newSceneDiffs;
      this.animationIndex = 0;
      this.animationOffset = 0;
      this.scene.clear();
      this.scene.clearAnimation();

      // Initialize mobjects
      let groupNames = [];
      for (let mobjectName of Object.keys(newMobjects)) {
        let data = newMobjects[mobjectName];
        if (!utils.isGroupData(data)) {
          this.setMobjectField(data);
        } else {
          groupNames.push(mobjectName);
        }
      }

      // Initialize groups
      for (let groupName of groupNames) {
        let data = newMobjects[groupName];
        this.setMobjectField(data);
      }

      this.currentAnimation.animation = this.buildCurrentAnimation();
      this.scene.update();
      this.priorScene = [];
      this.currentSceneDiff = this.setupDiffs[0];
      this.currentAnimationDiff = Manim[this.currentAnimation.className].getDiff(
        ...this.currentAnimation.args
      );
      this.applyDiff(
        this.currentSceneDiff,
        /*reverse=*/ false,
        /*moveCursor=*/ false
      );
      // this.play(null, /*singleAnimationOnly=*/false);
    },
    toggleCode() {
      if (this.displayCode) {
        this.displayCode = false;
      } else {
        this.displayCode = true;
      }
    },
    setMobjectField(mobjectData) {
      if (!utils.isGroupData(mobjectData)) {
        let s = new Manim[mobjectData.className](mobjectData.params);
        s.translateMobject(mobjectData.position);
        s.applyStyle(mobjectData.style);
        mobjectData.mobject = s;
        return s;
      } else {
        let mobs = mobjectData.submobjects.map(
          mobjectName => this.mobjects[mobjectName].mobject
        );
        let g = new Manim["Group"](mobs);
        mobjectData.mobject = g;
      }
    },
    pause: function() {
      this.scene.pause();
    },
    buildCurrentAnimation: function() {
      let args = [];
      for (let mobjectName of this.currentAnimation.args) {
        let data = this.mobjects[mobjectName];
        // eslint-disable-next-line
        console.assert(data !== undefined, { name: mobjectName });
        // eslint-disable-next-line
        console.assert(data.mobject !== null, {
          name: mobjectName,
          mobjects: this.mobjects
        });
        args.push(data.mobject);
      }
      return new Manim[this.currentAnimation.className](...args);
    },
    chainNextAnimation: function() {
      if (this.animationIndex === this.animations.length - 1) {
        return;
      }
      this.stepForward();
      if (this.animationIsValid && this.sceneIsValid) {
        this.scene.playAnimation(
          this.currentAnimation.animation,
          /*onStep=*/ this.onAnimationStep,
          /*onAnimationFinished=*/ () => {
            this.applyDiff(this.currentAnimationDiff);
            this.chainNextAnimation();
          }
        );
      }
    },
    replay: function(e, singleAnimationOnly = true) {
      if (singleAnimationOnly) {
        this.jumpToAnimationStart();
      } else {
        while (this.animationIndex > 0 || this.animationOffset > 0) {
          this.stepBackward();
        }
      }
      this.play(e, singleAnimationOnly);
    },
    play: function(e, singleAnimationOnly = true) {
      this.playingSingleAnimation = singleAnimationOnly;
      if (this.animating) {
        this.scene.play();
        return;
      }
      if (this.animationOffset === 1) {
        // eslint-disable-next-line
        console.assert(
          singleAnimationOnly === false &&
            this.animationIndex !== this.animations.length - 1
        );
        this.stepForward();
      }
      if (this.animationIsValid && this.sceneIsValid) {
        this.currentAnimation.animation = this.buildCurrentAnimation();
        this.scene.playAnimation(
          this.currentAnimation.animation,
          /*onStep=*/ this.onAnimationStep,
          /*onAnimationFinished=*/ () => {
            this.applyDiff(this.currentAnimationDiff);
            if (!this.playingSingleAnimation) {
              this.chainNextAnimation();
            }
          }
        );
      }
    },
    /*  Updates the mobjects in this.scene according to the diff. Diffs are of
     *  the form:
     *  {
     *    'add':    [mobject11, ...],
     *    'remove': [mobject21, ...],
     *    'modify': [[mobject31, forwardFunc, backwardFunc], ...],
     *  }
     */
    applyDiff: function(diff, reverse = false, moveCursor = true) {
      if (moveCursor) {
        this.animationOffset = reverse ? 0 : 1;
      }
      if (_.isEmpty(diff)) {
        return;
      }
      let diffCopy = _.cloneDeep(diff);
      diffCopy["add"] = diff["add"] || [];
      diffCopy["remove"] = diff["remove"] || [];
      diffCopy["modify"] = diff["modify"] || [];
      if (reverse) {
        diffCopy["add"] = diff["remove"] || [];
        diffCopy["remove"] = diff["add"] || [];
        diffCopy["modify"].forEach((newList, index) => {
          let oldList = diff["modify"][index];
          newList[1] = oldList[2];
          newList[2] = oldList[1];
        });
      }
      for (let mobjectName of diffCopy["add"]) {
        let mobjectData = this.mobjects[mobjectName];
        this.setMobjectField(mobjectData);
        this.scene.add(mobjectData.mobject);
      }
      for (let mobjectName of diffCopy["remove"]) {
        // THIS NEEDS TO BE GROUP-COMPATIBLE
        let mobjectData = this.mobjects[mobjectName];
        this.scene.remove(mobjectData.mobject);
        this.setMobjectField(mobjectData);
      }
      for (let [mobjectName, modifyFunc] of diffCopy["modify"]) {
        let mobjectData = this.mobjects[mobjectName];
        // eslint-disable-next-line
        console.assert(
          mobjectData.mobject && this.scene.contains(mobjectData.mobject)
        );
        modifyFunc(mobjectData.mobject);
      }
      this.scene.update();
    },
    jumpToAnimationStart: function() {
      if (this.animationOffset === 0) {
        return;
      } else if (this.animationOffset < 1) {
        // eslint-disable-next-line
        console.assert(this.animationIsValid);
        this.scene.clearAnimation();
        if (this.currentAnimation.args.length > 0) {
          let mobjectToRevertName = this.currentAnimation.args[0];
          let mobjectToRevertData = this.mobjects[mobjectToRevertName];
          this.scene.remove(mobjectToRevertData.mobject);
          this.setMobjectField(mobjectToRevertData);
          this.scene.add(mobjectToRevertData.mobject);
          this.scene.update();
        }
      } else {
        if (this.animationIsValid) {
          this.applyDiff(
            this.currentAnimationDiff,
            /*reverse=*/ true,
            /*moveCursor=*/ true
          );
        }
      }
      this.animationOffset = 0;
    },
    jumpToAnimationEnd: function() {
      if (this.animationOffset === 1) {
        return;
      } else if (this.animationOffset < 1) {
        this.jumpToAnimationStart();
      }
      if (this.animationIsValid && this.sceneIsValid) {
        this.applyDiff(this.currentAnimationDiff);
      }
    },
    stepForward: function() {
      if (!this.sceneIsValid || !this.animationIsValid) {
        return;
      }
      this.jumpToAnimationEnd();
      if (this.animationIndex < this.animations.length - 1) {
        this.setupDiffs[this.animationIndex] = this.currentSceneDiff;
        this.stepPriorSceneForward();
        this.animationIndex += 1;
        this.animationOffset = 0;
        this.currentAnimation.animation = this.buildCurrentAnimation();
        this.currentSceneDiff = this.setupDiffs[this.animationIndex];
        this.currentAnimationDiff = Manim[this.currentAnimation.className].getDiff(
          ...this.currentAnimation.args
        );
        if (this.sceneIsValid) {
          this.applyDiff(
            this.currentSceneDiff,
            /*reverse=*/ false,
            /*moveCursor=*/ false
          );
        }
      }
    },
    stepBackward: function() {
      if (this.animationOffset !== 0) {
        this.jumpToAnimationStart();
      } else if (this.animationIndex !== 0) {
        this.applyDiff(
          this.currentSceneDiff,
          /*reverse=*/ true,
          /*moveCursor=*/ false
        );
        this.setupDiffs[this.animationIndex] = this.currentSceneDiff;
        this.animationIndex -= 1;
        this.animationOffset = 1;
        this.currentAnimation.animation = this.buildCurrentAnimation();
        this.stepPriorSceneBackward(
          this.setupDiffs[this.animationIndex],
          Manim[this.currentAnimation.className].getDiff(
            ...this.currentAnimation.args
          ),
        );
        this.currentSceneDiff = this.setupDiffs[this.animationIndex];
        this.currentAnimationDiff = Manim[this.currentAnimation.className].getDiff(
          ...this.currentAnimation.args
        );
        this.jumpToAnimationStart();
      }
    },
    onAnimationStep: function(elapsedSeconds) {
      this.animationOffset = elapsedSeconds;
    },
    jumpToMobjectLocation(mobjectData) {
      let mobjectIsAtStart;
      let diff = this.currentAnimation.diff;
      let attr = diff[0];
      if (attr === null) {
        mobjectIsAtStart = diff[1] === mobjectData.name;
      } else {
        mobjectIsAtStart = _.split(diff[1], ".")[0] === mobjectData.name;
      }
      if (mobjectIsAtStart) {
        this.jumpToAnimationStart(/*forceDraw=*/ true);
      } else {
        this.jumpToAnimationEnd(/*forceDraw=*/ true);
      }
    },
    handleMobjectUpdate(mobjectName, attr, val) {
      // How could this jump to a Mobjects location? Get it from the animation
      // panel?
      // eslint-disable-next-line
      console.assert(
        this.scene.contains(this.mobjects[mobjectName].mobject),
        "modified mobject that isn't in the scene"
      );
      let oldMobject = this.mobjects[mobjectName].mobject;
      let parent = oldMobject.parent;
      let oldMobjectIndex = parent.children.indexOf(oldMobject);
      parent.remove(oldMobject);
      let split = attr.split(".");
      if (split[0] === "style") {
        this.$set(this.mobjects[mobjectName].style, split[1], val);
      } else {
        this.$set(this.mobjects[mobjectName], attr, val);
      }
      this.setMobjectField(this.mobjects[mobjectName]);
      parent.children.splice(
        oldMobjectIndex,
        0,
        this.mobjects[mobjectName].mobject
      );
      this.scene.update();
    },
    handleNewAnimation() {
      while (
        this.animationIndex < this.animations.length - 1 ||
        this.animationOffset < 1
      ) {
        if (this.sceneIsValid && this.animationIsValid) {
          this.stepForward();
        } else {
          return;
        }
      }
      this.animations.push({
        className: "Wait",
        description: "Hold a still frame",
        durationSeconds: 1,
        args: [],
        argDescriptions: []
      });
      this.setupDiffs.push({});
      this.stepForward();
    },
    newMobject() {
      let newMobjectData = {
        className: "Circle",
        params: {},
        position: [-1, 0],
        style: {
          strokeColor: "#fc6255ff",
          fillColor: "#00000000",
          strokeWidth: 4
        },
        mobject: null
      };
      this.setMobjectField(newMobjectData);
      this.$set(
        this.mobjects,
        "mobject" + (Object.keys(this.mobjects).length + 1),
        newMobjectData
      );
    },
    handleArgChange(argNum, arg) {
      if (this.animationOffset === 1) {
        this.applyDiff(
          this.currentAnimationDiff,
          /*reverse=*/ true,
          /*moveCursor=*/ false
        );
      }
      let newArgs = _.cloneDeep(this.currentAnimation.args);
      newArgs[argNum] = arg;
      this.currentAnimation.args = newArgs;
      this.currentAnimationDiff = Manim[this.currentAnimation.className].getDiff(
        ...this.currentAnimation.args
      );
      if (this.animationOffset === 1) {
        this.applyDiff(
          this.currentAnimationDiff,
          /*reverse=*/ false,
          /*moveCursor=*/ false
        );
      }
    },
    updateSetup(action, newSelection) {
      if (this.animationOffset === 1 && this.animationIsValid) {
        this.applyDiff(
          this.currentAnimationDiff,
          /*reverse=*/ true,
          /*moveCursor=*/ false
        );
      }
      this.applyDiff(
        this.currentSceneDiff,
        /*reverse=*/ true,
        /*moveCursor=*/ false
      );
      let newDiff = _.cloneDeep(this.currentSceneDiff);
      newDiff[action] = newSelection;
      this.currentSceneDiff = newDiff;
      this.applyDiff(
        this.currentSceneDiff,
        /*reverse=*/ false,
        /*moveCursor=*/ false
      );
      if (this.animationOffset === 1 && this.animationIsValid) {
        this.applyDiff(
          this.currentAnimationDiff,
          /*reverse=*/ false,
          /*moveCursor=*/ false
        );
      }
    },
    updateCode(newCode) {
      this.code = newCode;
    },
    refreshSceneChoices() {
      this.sceneChoices = window.manimlib.get_scene_choices(this.code);
    },
    diffIsValidForScene(diff, scene) {
      for (let mobjectName of diff["add"] || []) {
        // A Mobject can be added if none of the Mobjects in its heirarchy are
        // in the scene.
        let namesInHeirarchy = this.getNamesInHeirarchy(mobjectName);
        for (let submobName of namesInHeirarchy) {
          if (scene.includes(submobName)) {
            return false;
          }
        }
      }
      for (let mobjectName of diff["remove"] || []) {
        // A Mobject can be removed if it or any of its ancestors are in the
        // scene.
        let namesInLineage = this.getNamesInLineage(mobjectName);
        let lineageMemberInScene = false;
        for (let submobName of namesInLineage) {
          if (scene.includes(submobName)) {
            lineageMemberInScene = true;
            break;
          }
        }
        if (!lineageMemberInScene) {
          return false;
        }
      }
      return true;
    },
    getNamesInHeirarchy(mobjectName) {
      if (this.mobjects[mobjectName] === undefined) {
        return [];
      }
      let ret = [mobjectName];
      let data = this.mobjects[mobjectName];
      if ("submobjects" in data) {
        for (let submobName of data.submobjects) {
          ret = _.concat(ret, this.getNamesInHeirarchy(submobName));
        }
      }
      return ret;
    },
    getNamesInLineage(mobjectName) {
      if (this.mobjects[mobjectName] === undefined) {
        return [];
      }
      let currentMobject = this.mobjects[mobjectName].mobject;
      let mobjectsInLineage = [currentMobject];
      while (currentMobject.parent !== undefined) {
        currentMobject = currentMobject.parent;
        // Don't add the Group representing the Scene.
        if (
          !(
            currentMobject.parent &&
            currentMobject.parent.hasOwnProperty("domElement")
          )
        ) {
          mobjectsInLineage = _.concat(mobjectsInLineage, currentMobject);
        } else {
          break;
        }
      }
      return mobjectsInLineage.map(mob => this.getNameFromMobject(mob));
    },
    getNameFromMobject(mob) {
      for (let mobjectName of Object.keys(this.mobjects)) {
        if (this.mobjects[mobjectName].mobject === mob) {
          return mobjectName;
        }
      }
      // eslint-disable-next-line
      console.error("Encountered a mobject with no name: ", mob);
    },
    stepPriorSceneForward() {
      // TODO: use utils.updateSceneWithDiff
      let newScene = _.cloneDeep(this.priorScene);
      newScene = _.concat(newScene, this.currentSceneDiff['add'] || []);
      newScene = _.difference(newScene, this.currentSceneDiff['remove'] || []);
      newScene = _.concat(newScene, this.currentAnimationDiff['add'] || []);
      newScene = _.difference(newScene, this.currentAnimationDiff['remove'] || []);
      this.priorScene = newScene;
    },
    stepPriorSceneBackward(sceneDiff, animationDiff) {
      // TODO: use utils.updateSceneWithDiff
      let newScene = _.cloneDeep(this.priorScene);
      newScene = _.concat(newScene, animationDiff['remove'] || []);
      newScene = _.difference(newScene, animationDiff['add'] || []);
      newScene = _.concat(newScene, sceneDiff['remove'] || []);
      newScene = _.difference(newScene, sceneDiff['add'] || []);
      this.priorScene = newScene;
    },
  }
}
</script>