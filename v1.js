function onButtonClick()
{
    navigator.bluetooth.requestLEScan({
        keepRepeatedDevices: true,
        acceptAllAdvertisements: true
    })
    .then(() => {
        navigator.bluetooth.addEventListener('advertisementreceived', event => {                        
            //console.log(event);
            $('#ready').hide();
            $('#scanning').show();
            let appData = event.manufacturerData.get(0x004C);                        
            console.log(appData);
            
            if (appData === undefined) {
                return;
            }

            if (appData.byteLength < 23 || appData.byteLength > 31) {
                return;
            }

            $('#scanning-modal').modal('hide');
            $('#resultBlock').show();
            let major = appData.getUint16(18, false);
            let minor = appData.getUint16(20, false);
            let txPowerAt1m = -appData.getInt8(22);
            let pathLossVs1m = txPowerAt1m - event.rssi;            
            console.log('major: ' + major);
            console.log('minor: ' + minor);
            console.log('txPower: ' + txPowerAt1m);
            console.log('pathLoss: ' + pathLossVs1m);
            document.getElementById('major').value = major;
            document.getElementById('minor').value = minor;
        })
    });
}

$(document).ready(function () {
    $('#scanning-modal').modal('show');

    $('#start-scanning').click(function (event) {
        console.log(event);
        onButtonClick();
    });
    
    $('#close-scanning').click(function (event) {
        console.log(event);
        navigator.bluetooth.removeEventListener('advertisementreceived', event => {
            console.log(event);
        });
    })
})
