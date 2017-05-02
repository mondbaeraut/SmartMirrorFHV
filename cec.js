var nodecec = require('node-cec');

var NodeCec = nodecec.NodeCec;
var CEC = nodecec.CEC;

/*
 * https://blog.gordonturner.com/2016/12/14/using-cec-client-on-a-raspberry-pi/
 * https://blog.gordonturner.com/2016/12/19/stupid-remote-a-hdmi-cec-node-js-web-app/
 * 'manual' https://github.com/patlux/node-cec
 */

module.exports.activateDisplay = function() {
	var cec = new NodeCec('node-cec-monitor');
	cec.sendCommand(CEC.OpCode.IMAGE_VIEW_ON); // TODO
}
