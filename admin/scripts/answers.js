// $Id: templates.js 7699 2009-09-30 22:28:50Z c_schmitz $

$(document).ready(function(){
       $('.tab-page:first .answertable tbody').sortable({   containment:'parent',
                                            update:aftermove,
                                            distance:3});
       $('.btnaddanswer').click(addinput);
       $('.btndelanswer').click(deleteinput); 
       $('.btneditanswer').click(popupeditor);
       $('#editanswersform').submit(code_duplicates_check)
});


function deleteinput()
{

    // 1.) Check if there is at least one answe
     
    countanswers=$(this).parent().parent().parent().children().length;
    if (countanswers>1)
    {
       // 2.) Remove the table row
       var x;
       classes=$(this).closest('tr').attr('class').split(' ');
       for (x in classes)
       {
           if (classes[x].substr(0,3)=='row'){
               position=classes[x].substr(4);
           }
       }          
       info=$(this).closest('table').attr('id').split("_"); 
       language=info[1];
       scale_id=info[2];
       languages=langs.split(';');
       var x;
       for (x in languages)
       {
            tablerow=$('#tabpage_'+languages[x]).find('#answers_'+languages[x]+'_'+scale_id+' .row_'+position);
            if (x==0) {
               tablerow.fadeTo(400, 0, function(){
                       $(this).remove();  
                       updaterowproperties();       
               });            
            }
            else {
                tablerow.remove();
            }
        }       
    }
    else
    {
       $.blockUI({message:"<p><br/>You cannot delete the last answer.</p>"});
       setTimeout(jQuery.unblockUI,1000);   
    }
    updaterowproperties();     
}


function addinput()
{
    var x;
    classes=$(this).closest('tr').attr('class').split(' ');
    for (x in classes)
    {
        if (classes[x].substr(0,3)=='row'){
            position=classes[x].substr(4);
        }
    }    
    info=$(this).closest('table').attr('id').split("_"); 
    language=info[1];
    scale_id=info[2];
    newposition=Number(position)+1;
    languages=langs.split(';');

    for (x in languages)
    {
        tablerow=$('#tabpage_'+languages[x]).find('#answers_'+languages[x]+'_'+scale_id+' .row_'+position);
        if (assessmentvisible)
        {
            assessment_style='';
            assessment_type='text';
        }
        else
        {
            assessment_style='style="display:none;"';
            assessment_type='hidden';
        }
        if (x==0) {
            inserthtml='<tr class="row_'+newposition+'" style="display:none;"><td><img class="handle" src="../images/handle.png" /></td><td><input class="code" type="text" maxlength="5" size="5" value="'+getNextCode($(this).parent().parent().find('.code').val())+'" /></td><td '+assessment_style+'><input class="assessment" type="'+assessment_type+'" maxlength="5" size="5" value="1"/></td><td><input type="text" size="80" class="answer" value="'+newansweroption_text+'"></input><img src="../images/edithtmlpopup.png" class="btneditanswer" /></td><td><img src="../images/addanswer.png" class="btnaddanswer" /><img src="../images/deleteanswer.png" class="btndelanswer" /></td></tr>'
        }
        else
        {
            inserthtml='<tr class="row_'+newposition+'" style="display:none;"><td>&nbsp;</td><td>&nbsp;</td><td><input type="text" size="80" class="answer" value="New answer option"></input><img src="../images/edithtmlpopup.png" class="btnaddanswer" /></td><td><img src="../images/addanswer.png" class="btnaddanswer" /><img src="../images/deleteanswer.png" class="btndelanswer" /></td></tr>'
        }
        tablerow.after(inserthtml);
        tablerow.next().find('.btnaddanswer').click(addinput);
        tablerow.next().find('.btneditanswer').click(popupeditor);
        tablerow.next().find('.btndelanswer').click(deleteinput);
        tablerow.next().find('.answer').focus(function(){
            if ($(this).val()==newansweroption_text)
            {
                $(this).val('');
            }
        });
        tablerow.next().fadeIn(800);
        tablerow.next().find('.code').blur(updatecodes);
    }
                                                                 
    if(languagecount>1)
    {
        
    }
    
    $('.answertable tbody').sortable('refresh');
    updaterowproperties();
}

function aftermove(event,ui)
{
    // But first we have change the sortorder in translations, too  
    var x;
    classes=ui.item.attr('class').split(' ');
    for (x in classes)
    {
        if (classes[x].substr(0,3)=='row'){
            oldindex=classes[x].substr(4);
        }
    } 
 
   var newindex = $(ui.item[0]).parent().children().index(ui.item[0]);
  
   info=$(ui.item[0]).closest('table').attr('id').split("_"); 
   language=info[1];
   scale_id=info[2];  
   
   languages=langs.split(';');
   var x;
   for (x in languages)
   {
        if (x>0) {
            tablebody=$('#tabpage_'+languages[x]).find('#answers_'+languages[x]+'_'+scale_id+' tbody');
            if (newindex<oldindex)
            {
                tablebody.find('.row_'+newindex).before(tablebody.find('.row_'+oldindex));
            }
            else
            {
                tablebody.find('.row_'+newindex).after(tablebody.find('.row_'+oldindex));
            }
        }
    }           
    updaterowproperties();
}

// This function adjust the alternating table rows and renames IDs and names
// if the list has really changed
function updaterowproperties()
{
  
    
  $('.answertable tbody').each(function(){
      info=$(this).closest('table').attr('id').split("_"); 
      language=info[1];
      scale_id=info[2];
      var highlight=true;
      var rownumber=0;
      $(this).children('tr').each(function(){
          
         $(this).removeClass(); 
         if (highlight){
             $(this).addClass('highlight');
         }
         $(this).addClass('row_'+rownumber);
         $(this).find('.code').attr('id','code_'+rownumber+'_'+scale_id);
         $(this).find('.code').attr('name','code_'+rownumber+'_'+scale_id);
         $(this).find('.answer').attr('id','answer_'+language+'_'+rownumber+'_'+scale_id);
         $(this).find('.answer').attr('name','answer_'+language+'_'+rownumber+'_'+scale_id);
         $(this).find('.assessment').attr('id','assessment_'+rownumber+'_'+scale_id);
         $(this).find('.assessment').attr('name','assessment_'+rownumber+'_'+scale_id);
         highlight=!highlight;
         rownumber++;
      })
      $('#answercount_'+scale_id).val(rownumber);
  })  
}

// This is a helper function to extract the question ID from a DOM ID element 
function removechars(strtoconvert){
  return strtoconvert.replace(/[a-zA-Z_]/g,"");
}

function updatecodes()
{

}

function getNextCode(sourcecode)
{
    i=1; 
    found=true;
    foundnumber=-1;
    while (i<=sourcecode.length && found)   
    {
        found=is_numeric(sourcecode.substr(-i));
        if (found) 
        {
            foundnumber=sourcecode.substr(-i);
            i++;
        }   
    }
    if (foundnumber==-1) 
    {
        return(sourcecode);
    }
    else 
    {
       foundnumber++; 
       foundnumber=foundnumber+'';
       result=sourcecode.substr(0,sourcecode.length-foundnumber.length)+foundnumber;
       return(result);
    }
    
}

function is_numeric (mixed_var) {
    return (typeof(mixed_var) === 'number' || typeof(mixed_var) === 'string') && mixed_var !== '' && !isNaN(mixed_var);
}

function popupeditor()
{
    input_id=$(this).parent().find('.answer').attr('id');
    start_popup_editor(input_id);
}

function code_duplicates_check()
{
    //return false;
}