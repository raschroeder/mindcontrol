import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './module_templates.html';
import "./d3_plots.js"


get_filter = function(entry_type){

 var globalSelector = Session.get("globalSelector")
    var myselect = {}
    myselect["entry_type"] = entry_type

    if (globalSelector){
        globalKeys = Object.keys(globalSelector)
        //console.log("global keys are", globalKeys, globalKeys.indexOf(entry_type))
        if (globalKeys.indexOf(entry_type) >= 0){
            var localKeys = Object.keys(globalSelector[entry_type])
            //console.log("local keys are", localKeys)
            for (i=0;i<localKeys.length;i++){
                myselect[localKeys[i]] = globalSelector[entry_type][localKeys[i]]
            }//end for
        };//end if

        //console.log("selector for", entry_type, "is", myselect)

        // In this part, if another filter has filtered subjects, then filter on the rest
        var subselect = Session.get("subjectSelector")

        if (subselect["subject_id"]["$in"].length){
            myselect["subject_id"] = subselect["subject_id"]
        }
        //console.log("myselect is", myselect)
        return myselect
    }


}

get_metrics = function(entry_type){
    Meteor.call("get_metric_names", entry_type, function(error, result){
            Session.set(entry_type+"_metrics", result)
        })
        return Session.get(entry_type+"_metrics")
}

render_histogram = function(entry_type){
                var metric = Session.get("current_"+entry_type)//"Amygdala"
                if (metric == null){
                    var all_metrics = Session.get(entry_type+"_metrics")

                    if (all_metrics != null){
                        Session.set("current_"+entry_type, all_metrics[0])
                    }

                }

                if (metric != null){
                    var filter = get_filter(entry_type)
                    //console.log("filter is", filter)
                    Meteor.call("getHistogramData", entry_type, metric, 20, filter, function(error, result){
                    //console.log("result is", result)
                    var data = result["histogram"]
                    var minval = result["minval"]
                    var maxval = result["maxval"]
                    if (data.length){
                        do_d3_histogram(data, minval, maxval, metric, "#d3vis_"+entry_type, entry_type)
                    }
                    else{
                        console.log("attempt to clear histogram here")
                    }


                    });
                }
}



Template.demographic.rendered = function() {

      if (!this.rendered){
        this.rendered = true
         }


    

       this.autorun(function() {
                render_histogram("demographic")

       }); //end autorun

     

  }





Template.qa.rendered = function() {

      if (!this.rendered){
        this.rendered = true
         }


    

       this.autorun(function() {
                render_histogram("qa")

       }); //end autorun

     

  }





Template.ants.rendered = function() {

      if (!this.rendered){
        this.rendered = true
         }


    

       this.autorun(function() {
                render_histogram("ants")

       }); //end autorun

     

  }







Template.demographic.helpers({

selector: function(){return get_filter("demographic")},



metric: function(){
        return get_metrics("demographic")
    },
currentMetric: function(){
        return Session.get("current_demographic")
    }



})



Template.qa.helpers({

selector: function(){return get_filter("qa")},



metric: function(){
        return get_metrics("qa")
    },
currentMetric: function(){
        return Session.get("current_qa")
    }



})



Template.ants.helpers({

selector: function(){return get_filter("ants")},



metric: function(){
        return get_metrics("ants")
    },
currentMetric: function(){
        return Session.get("current_ants")
    }



})




  
   Template.demographic.events({
    "change #metric-select-demographic": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("current_demographic", metric)
    }
   })
  

  
   Template.qa.events({
    "change #metric-select-qa": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("current_qa", metric)
    }
   })
  

  
   Template.ants.events({
    "change #metric-select-ants": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("current_ants", metric)
    }
   })
  
