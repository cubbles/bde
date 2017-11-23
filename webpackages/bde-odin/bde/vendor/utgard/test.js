//init utgard
//Konfiguration
utgard.config.websockifyURL = 'ws://asgard'; //Websocket Adresse Asgard
utgard.config.websockifyPort = 4444;              //Websocket Port    Asgard
utgard.config.websockifyURL_KB = utgard.config.websockifyURL; //Websocket Adresse Hel
utgard.config.websockifyPort_KB = 3333;                       //Websocket Port    Hel
utgard.connectToServer(function(){ //stellt eine Verbindung zu Asgard UND Hel her
  //onOpen -> will be called 0 - 2 times (Asgard and/or KB)
  console.log("Verbindung hergestellt");
  runOnce();
}, function () {
  //onError -> will be called 0 - 2 times (Asgard and/or KB)
  console.log("Hoppla, da ging etwas schief");
});
utgard.setCallback(function(suggestionsMsg){ //Einrichten der Callback Funktion
  console.log(suggestionsMsg); //in diesem Beispiel wird das Resultat nur auf der Konsole ausgegeben
});

//Die folgenden drei Funktionen sind hypothetische(!) Event-Handler der BDE
var addHandler = function (evt) {
  var objectID = idEnum++; //numerischer Wert, beginnend bei 1
  var boundingBox = evt.source.getBoundingRect();  // x und y Coord + Länge/Breite
  utgard.addObject({id: objectID,
    posX: boundingBox.left,
    posY: boundingBox.top,
    dimX: boundingBox.width,
    dimY: boundingBox.height,
    content: evt.source.getContent() //z.B. de.iisys.va.allmightywebpackage@13.37/solveMyProblem
  });
};

var moveHandler = function (evt) {
  var objectID = evt.source.getID();
  var boundingBox = evt.source.getBoundingRect();
  utgard.moveBoundingA(boundingBox.left, boundingBox.top, objectID);
};

var removeHandler = function (evt) {
  var objectID = evt.source.getID();
  utgard.removeObjects([objectID]);
};
runOnceDone = 0;
function runOnce () {
  if (runOnceDone === 1) {
    utgard.addObject({id: 1,
      posX: 70,
      posY: 40,
      dimX: 10,
      dimY: 10,
      content: 'com.incowia.cubx-webpackage-viewer-package@1.1.0/cubx-component-info-viewer' //z.B. de.iisys.va.allmightywebpackage@13.37/solveMyProblem
      // content: 'com.incowia.cubx-webpackage-viewer-package@1.5.1/cubx-component-info-viewer' //z.B. de.iisys.va.allmightywebpackage@13.37/solveMyProblem
      // content: 'dep-tree-viewer@1.1.1/cubx-dep-tree-viewer'
      // content: 'com.incowia.cubx-marked-element@1.0/cubx-marked-element'
    });
  }
  runOnceDone++;
}