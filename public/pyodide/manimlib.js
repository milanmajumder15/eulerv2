var Module=typeof pyodide._module!=="undefined"?pyodide._module:{};Module.checkABI(1);if(!Module.expectedDataFileDownloads){Module.expectedDataFileDownloads=0;Module.finishedDataFileDownloads=0}Module.expectedDataFileDownloads++;(function(){var loadPackage=function(metadata){var PACKAGE_PATH;if(typeof window==="object"){PACKAGE_PATH=window["encodeURIComponent"](window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/")}else if(typeof location!=="undefined"){PACKAGE_PATH=encodeURIComponent(location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/")}else{throw"using preloaded data can only be done on a web page or in a web worker"}var PACKAGE_NAME="manimlib.data";var REMOTE_PACKAGE_BASE="manimlib.data";if(typeof Module["locateFilePackage"]==="function"&&!Module["locateFile"]){Module["locateFile"]=Module["locateFilePackage"];err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")}var REMOTE_PACKAGE_NAME=Module["locateFile"]?Module["locateFile"](REMOTE_PACKAGE_BASE,""):REMOTE_PACKAGE_BASE;var REMOTE_PACKAGE_SIZE=metadata.remote_package_size;var PACKAGE_UUID=metadata.package_uuid;function fetchRemotePackage(packageName,packageSize,callback,errback){var xhr=new XMLHttpRequest;xhr.open("GET",packageName,true);xhr.responseType="arraybuffer";xhr.onprogress=function(event){var url=packageName;var size=packageSize;if(event.total)size=event.total;if(event.loaded){if(!xhr.addedTotal){xhr.addedTotal=true;if(!Module.dataFileDownloads)Module.dataFileDownloads={};Module.dataFileDownloads[url]={loaded:event.loaded,total:size}}else{Module.dataFileDownloads[url].loaded=event.loaded}var total=0;var loaded=0;var num=0;for(var download in Module.dataFileDownloads){var data=Module.dataFileDownloads[download];total+=data.total;loaded+=data.loaded;num++}total=Math.ceil(total*Module.expectedDataFileDownloads/num);if(Module["setStatus"])Module["setStatus"]("Downloading data... ("+loaded+"/"+total+")")}else if(!Module.dataFileDownloads){if(Module["setStatus"])Module["setStatus"]("Downloading data...")}};xhr.onerror=function(event){throw new Error("NetworkError for: "+packageName)};xhr.onload=function(event){if(xhr.status==200||xhr.status==304||xhr.status==206||xhr.status==0&&xhr.response){var packageData=xhr.response;callback(packageData)}else{throw new Error(xhr.statusText+" : "+xhr.responseURL)}};xhr.send(null)}function handleError(error){console.error("package error:",error)}var fetchedCallback=null;var fetched=Module["getPreloadedPackage"]?Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE):null;if(!fetched)fetchRemotePackage(REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE,function(data){if(fetchedCallback){fetchedCallback(data);fetchedCallback=null}else{fetched=data}},handleError);function runWithFS(){function assert(check,msg){if(!check)throw msg+(new Error).stack}Module["FS_createPath"]("/","lib",true,true);Module["FS_createPath"]("/lib","python3.7",true,true);Module["FS_createPath"]("/lib/python3.7","site-packages",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages","manimlib",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib","utils",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib","mobject",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib/mobject","types",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib/mobject","svg",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib","animation",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib","camera",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib","scene",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib","web",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib","container",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages/manimlib","files",true,true);Module["FS_createPath"]("/lib/python3.7/site-packages","manimlib-0.1.11.dev103-py3.7.egg-info",true,true);Module["FS_createPath"]("/","bin",true,true);function DataRequest(start,end,audio){this.start=start;this.end=end;this.audio=audio}DataRequest.prototype={requests:{},open:function(mode,name){this.name=name;this.requests[name]=this;Module["addRunDependency"]("fp "+this.name)},send:function(){},onload:function(){var byteArray=this.byteArray.subarray(this.start,this.end);this.finish(byteArray)},finish:function(byteArray){var that=this;Module["FS_createPreloadedFile"](this.name,null,byteArray,true,true,function(){Module["removeRunDependency"]("fp "+that.name)},function(){if(that.audio){Module["removeRunDependency"]("fp "+that.name)}else{err("Preloading file "+that.name+" failed")}},false,true);this.requests[this.name]=null}};function processPackageData(arrayBuffer){Module.finishedDataFileDownloads++;assert(arrayBuffer,"Loading data file failed.");assert(arrayBuffer instanceof ArrayBuffer,"bad input to processPackageData");var byteArray=new Uint8Array(arrayBuffer);var curr;var compressedData={data:null,cachedOffset:284524,cachedIndexes:[-1,-1],cachedChunks:[null,null],offsets:[0,1047,1839,2732,3834,4767,5809,6899,8039,9176,9952,11192,12526,13711,15113,16450,17830,18966,20213,21520,22727,23953,25099,26375,27455,28673,29964,31189,32530,33897,35071,36159,37061,38169,39402,40519,41623,42806,43874,44879,46024,47209,48176,49307,50354,51400,52405,53608,54606,55815,56873,57899,58953,59960,61134,62283,63355,64418,65283,66265,67296,68335,69273,70091,71160,72210,73235,74299,75076,76012,77141,78221,79297,80425,81556,82659,83906,84970,86126,87211,88379,89303,90328,91528,92504,93492,94606,95747,96776,97761,98906,100002,100993,102113,103124,104202,105435,106558,107932,109044,109844,110645,111457,112346,113403,114444,115452,116619,117646,118762,119860,120973,122019,123117,124209,125158,126262,127300,128505,129537,130441,131441,132612,133755,134739,135884,136943,137976,139077,140214,141139,141952,143019,144115,145215,146346,147440,148661,149673,150486,151387,152298,153463,154427,155574,156758,157868,158978,160126,161222,162264,163325,164428,165547,166469,167584,168621,169690,170732,171829,172967,173987,175252,176417,177489,178620,179758,180777,181883,182994,183943,184671,185641,186736,187884,188806,189720,190779,191670,192936,193898,194949,195973,197020,198192,199215,200485,201520,202670,203456,204445,205449,206480,207370,208379,209324,210246,211354,212325,213429,214396,215323,216279,217428,218476,219437,220524,221583,222755,223838,224912,226010,227055,228135,229090,230114,231053,232068,233266,234244,235378,236281,237457,238428,239503,240500,241870,243541,245256,246663,248439,249847,251538,253250,254328,255825,257334,259056,260755,262484,263713,264920,266585,268289,269953,271628,272697,273699,275243,276378,277654,278710,280038,281301,282672,284106],sizes:[1047,792,893,1102,933,1042,1090,1140,1137,776,1240,1334,1185,1402,1337,1380,1136,1247,1307,1207,1226,1146,1276,1080,1218,1291,1225,1341,1367,1174,1088,902,1108,1233,1117,1104,1183,1068,1005,1145,1185,967,1131,1047,1046,1005,1203,998,1209,1058,1026,1054,1007,1174,1149,1072,1063,865,982,1031,1039,938,818,1069,1050,1025,1064,777,936,1129,1080,1076,1128,1131,1103,1247,1064,1156,1085,1168,924,1025,1200,976,988,1114,1141,1029,985,1145,1096,991,1120,1011,1078,1233,1123,1374,1112,800,801,812,889,1057,1041,1008,1167,1027,1116,1098,1113,1046,1098,1092,949,1104,1038,1205,1032,904,1e3,1171,1143,984,1145,1059,1033,1101,1137,925,813,1067,1096,1100,1131,1094,1221,1012,813,901,911,1165,964,1147,1184,1110,1110,1148,1096,1042,1061,1103,1119,922,1115,1037,1069,1042,1097,1138,1020,1265,1165,1072,1131,1138,1019,1106,1111,949,728,970,1095,1148,922,914,1059,891,1266,962,1051,1024,1047,1172,1023,1270,1035,1150,786,989,1004,1031,890,1009,945,922,1108,971,1104,967,927,956,1149,1048,961,1087,1059,1172,1083,1074,1098,1045,1080,955,1024,939,1015,1198,978,1134,903,1176,971,1075,997,1370,1671,1715,1407,1776,1408,1691,1712,1078,1497,1509,1722,1699,1729,1229,1207,1665,1704,1664,1675,1069,1002,1544,1135,1276,1056,1328,1263,1371,1434,418],successes:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]};compressedData.data=byteArray;assert(typeof Module.LZ4==="object","LZ4 not present - was your app build with  -s LZ4=1  ?");Module.LZ4.loadPackage({metadata:metadata,compressedData:compressedData});Module["removeRunDependency"]("datafile_manimlib.data")}Module["addRunDependency"]("datafile_manimlib.data");if(!Module.preloadResults)Module.preloadResults={};Module.preloadResults[PACKAGE_NAME]={fromCache:false};if(fetched){processPackageData(fetched);fetched=null}else{fetchedCallback=processPackageData}}if(Module["calledRun"]){runWithFS()}else{if(!Module["preRun"])Module["preRun"]=[];Module["preRun"].push(runWithFS)}};loadPackage({files:[{filename:"/lib/python3.7/site-packages/manimlib/media_dir.txt",start:0,end:5,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/__init__.py",start:5,end:2008,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/config.py",start:2008,end:10755,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/ctex_template.tex",start:10755,end:11249,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/tex_template.tex",start:11249,end:11743,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/extract_scene.py",start:11743,end:16677,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/imports.py",start:16677,end:20272,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/constants.py",start:20272,end:27720,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/config_ops.py",start:27720,end:30521,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/images.py",start:30521,end:31135,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/simple_functions.py",start:31135,end:33412,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/color.py",start:33412,end:36153,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/rate_functions.py",start:36153,end:38319,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/strings.py",start:38319,end:40182,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/iterables.py",start:40182,end:43300,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/file_ops.py",start:43300,end:45305,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/paths.py",start:45305,end:46729,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/tex_file_writing.py",start:46729,end:49645,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/sounds.py",start:49645,end:50384,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/space_ops.py",start:50384,end:56252,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/utils/bezier.py",start:56252,end:60812,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/probability.py",start:60812,end:68697,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/numbers.py",start:68697,end:73303,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/geometry.py",start:73303,end:98255,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/value_tracker.py",start:98255,end:99652,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/number_line.py",start:99652,end:105870,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/shape_matchers.py",start:105870,end:108102,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/changing.py",start:108102,end:111304,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/mobject.py",start:111304,end:149663,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/mobject_update_utils.py",start:149663,end:152257,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/vector_field.py",start:152257,end:163737,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/three_d_shading_utils.py",start:163737,end:165138,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/three_dimensions.py",start:165138,end:169420,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/coordinate_systems.py",start:169420,end:182863,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/functions.py",start:182863,end:185957,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/three_d_utils.py",start:185957,end:187529,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/matrix.py",start:187529,end:193332,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/frame.py",start:193332,end:194375,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/types/image_mobject.py",start:194375,end:198055,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/types/vectorized_mobject.py",start:198055,end:231262,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/types/point_cloud_mobject.py",start:231262,end:239588,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/svg/brace.py",start:239588,end:244364,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/svg/drawings.py",start:244364,end:278090,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/svg/svg_mobject.py",start:278090,end:293302,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/mobject/svg/tex_mobject.py",start:293302,end:304844,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/growing.py",start:304844,end:306095,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/numbers.py",start:306095,end:307817,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/transform.py",start:307817,end:317587,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/composition.py",start:317587,end:322525,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/movement.py",start:322525,end:324745,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/creation.py",start:324745,end:329891,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/animation.py",start:329891,end:335056,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/indication.py",start:335056,end:342933,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/specialized.py",start:342933,end:345559,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/rotation.py",start:345559,end:346977,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/fading.py",start:346977,end:351003,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/animation/update.py",start:351003,end:352239,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/camera/moving_camera.py",start:352239,end:355345,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/camera/three_d_camera.py",start:355345,end:363852,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/camera/camera.py",start:363852,end:380405,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/camera/multi_camera.py",start:380405,end:382645,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/camera/mapping_camera.py",start:382645,end:387148,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/vector_space_scene.py",start:387148,end:405661,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/media_dir.txt",start:405661,end:405666,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/zoomed_scene.py",start:405666,end:409179,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/sample_space_scene.py",start:409179,end:414481,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/moving_camera_scene.py",start:414481,end:415651,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/three_d_scene.py",start:415651,end:422084,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/reconfigurable_scene.py",start:422084,end:424131,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/graph_scene.py",start:424131,end:443717,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/scene/scene.py",start:443717,end:462207,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/web/web_mock.py",start:462207,end:501179,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/web/utils.py",start:501179,end:503631,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/web/web_scene.py",start:503631,end:505987,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/container/container.py",start:505987,end:506695,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/files/Bubbles_thought.svg",start:506695,end:508038,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/files/Bubbles_speech.svg",start:508038,end:508754,audio:0},{filename:"/lib/python3.7/site-packages/manimlib/files/PiCreatures_plain.svg",start:508754,end:510591,audio:0},{filename:"/lib/python3.7/site-packages/manimlib-0.1.11.dev103-py3.7.egg-info/SOURCES.txt",start:510591,end:513417,audio:0},{filename:"/lib/python3.7/site-packages/manimlib-0.1.11.dev103-py3.7.egg-info/requires.txt",start:513417,end:513430,audio:0},{filename:"/lib/python3.7/site-packages/manimlib-0.1.11.dev103-py3.7.egg-info/pbr.json",start:513430,end:513478,audio:0},{filename:"/lib/python3.7/site-packages/manimlib-0.1.11.dev103-py3.7.egg-info/top_level.txt",start:513478,end:513487,audio:0},{filename:"/lib/python3.7/site-packages/manimlib-0.1.11.dev103-py3.7.egg-info/entry_points.txt",start:513487,end:513528,audio:0},{filename:"/lib/python3.7/site-packages/manimlib-0.1.11.dev103-py3.7.egg-info/dependency_links.txt",start:513528,end:513529,audio:0},{filename:"/lib/python3.7/site-packages/manimlib-0.1.11.dev103-py3.7.egg-info/not-zip-safe",start:513529,end:513530,audio:0},{filename:"/lib/python3.7/site-packages/manimlib-0.1.11.dev103-py3.7.egg-info/PKG-INFO",start:513530,end:522542,audio:0},{filename:"/bin/manim",start:522542,end:522714,audio:0}],remote_package_size:288620,package_uuid:"97f1e0c2-ee06-4018-85e6-5ee47c6dcaed"})})();