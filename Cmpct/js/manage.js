var chosenShip=null;
var crewName=null;

function createClicked()
{
    $('#dialog-form').dialog('open');
}

function joinClicked()
{
    var shipName=$(this).parent().justtext();
    console.log('joined '+shipName);
    chosenShip=shipName;
    $('#crew-form').dialog('open');
}

function init()
{
    $('#dialog-form').dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            'Create': function() {
                var val=$('#name').val();
                if(val!='')
                {
                    $('#ships').append('<li>'+val+'<button class="joinButton">Join</button></li>');
                    $('.joinButton').button();
                    $('.joinButton').click(joinClicked);                    
                    $(this).dialog('close');
                }
            },
            'Cancel': function() {
                $(this).dialog('close');
            }
        },
        close: function() {
        }
    });
    
    $('#crew-form').dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            'Join': function() {
                var val=$('#crewName').val();
                if(val!='')
                {                    
                    crewName=val;
                    $(this).dialog('close');
                    redirect('play.html', {'shipName': chosenShip, 'crewName': crewName});                                        
                }
            },
            'Cancel': function() {
                $(this).dialog('close');
            }
        },
        close: function() {
        }
    });    

    $('#create').button().click(createClicked);
}

$(document).ready(init);