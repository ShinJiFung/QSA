import { Component, Input, OnInit  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PlotRequestTypesEnum, PlotRequestTypes2Label } from 'src/app/interfaces/data_extract'
import { ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { Plot1DFuncRequest, ExpDataAxes, PlotContourRequest, PlotParEqRequest } from 'src/app/interfaces/data_extract'

import { JobService } from 'src/app/services/job.service';
import { BackToPlotlyService } from 'src/app/services/back-to-plotly.service';
@Component({
  selector: 'app-plot-request-form',
  templateUrl: './plot-request-form.component.html',
  styleUrls: ['./plot-request-form.component.css']
})
export class PlotRequestFormComponent {
  @Input() preProcess_CMDs: [];
  pOptions = PlotRequestTypesEnum;
  pLabels = PlotRequestTypes2Label;

  req_form = this.fb.group({
    CMDs: '{}',
  });
  get_values = Object.values;

  graph: any;
  show_plot:boolean;

  // plotReqF1Form = this.fb.group({
  //   x: ['',Validators.required],
  //   y: ['',Validators.required],
  //   other_position: ['']
  // });

  // plotReqPEForm = this.fb.group({
  //   x: ['',Validators.required],
  //   y: ['',Validators.required],
  //   parameter: ['',Validators.required],
  //   other_position: ['']
  // });

  // plotReqP2Form = this.fb.group({
  //   x: ['',Validators.required],
  //   y: ['',Validators.required],
  //   z: ['',Validators.required],
  //   other_position: ['']
  // });  
  constructor(  private fb:FormBuilder,
                private route: ActivatedRoute,
                private jobService: JobService,
                // private location: Location
                private b2p:BackToPlotlyService ) {
    this.preProcess_CMDs = [];
    // this.pReq_F1 = true;
    // this.pReq_PE = false;
    // this.pReq_F2 = false;
    this.show_plot = false;
  }
  // onSelected(value:string): void {
  //   this.pReq_F1 = false;
  //   this.pReq_PE = false;
  //   this.pReq_F2 = false;
    
  //   switch(value){
  //     case PlotRequestTypesEnum.F1:
  //       console.log("Switch to 1D function")
  //       this.pReq_F1 = true;
  //       break;
  //     case PlotRequestTypesEnum.PE:
  //       console.log("Switch to parametric equation")
  //       this.pReq_PE = true;
  //       break;
  //     case PlotRequestTypesEnum.F2:
  //       console.log("Switch to 2D")
  //       this.pReq_F2 = true;
  //       break;
  //     default:
  //       console.log("Default")
  //   }
	// }

  __other_position_parser( pos_str:any ){
    if (typeof pos_str === "string" && pos_str!=''){
      let str_list = pos_str.split(",");
      console.log(str_list);

      return str_list.map((info)=>{
        let sep_info = info.split(":")
        let axis_info:ExpDataAxes = {
          name:sep_info[0],
          position:[Number(sep_info[1])]
        }
        return axis_info
      })
    }else{
      return []
    }
  }
  plotCMDfunction():void{
    console.log('press plotCMDfunction button');
    let jsonObj_plot = JSON.parse(this.req_form.value.CMDs!);
    console.log(jsonObj_plot);
    const jobid = this.route.snapshot.paramMap.get('jobId');
    if (jobid!=null){
      this.jobService.getJobPreview(jobid,jsonObj_plot,this.preProcess_CMDs).subscribe(data => {
        console.log(data)
        if (jsonObj_plot["type"] == "2DBasic"){
          this.preview2DBasic(data)
        }
        if (jsonObj_plot["type"] == "3DScalar"){
          this.preview3DScalar(data)
        }
      });
    };
  };
  preview2DBasic( data:any ): void{
    let tr_names:string[] = data["trace_name"];
    let x:number[][] = data["x"];
    let y:number[][] = data["y"];
    this.show_plot = true
    let traces = this.b2p.data1DTraces(tr_names, x, y)

    this.graph = {
      data: traces,
      layout: {width: 320, height: 240, title: 'Preview data'}
    };
    console.log(this.graph)
  };  
  
  preview3DScalar( data:any ): void{
    let tr_names:string[] = data["trace_name"];
    let x:number[] = data["x"];
    let y:number[] = data["y"];
    let z:number[][] = data["z"];
    this.show_plot = true
    let traces = this.b2p.dataContour(tr_names, x, y, z)

    this.graph = {
      data: traces,
      layout: {width: 320, height: 240, title: 'A Fancy Plot'}
    };
    console.log(this.graph)
  };  
 

  // previewParEq(): void{
  //   console.log('previewParEq button')
    
  //   const jobid = this.route.snapshot.paramMap.get('jobId');
  //   let userForm = this.plotReqPEForm.value;
  //   let pReq: PlotParEqRequest = {
  //     x:'',
  //     y:'',
  //     parameter:'',
  //     other_position:[]
  //   };
    
  //   if (typeof userForm.x === "string"){
  //     pReq.x = userForm.x
  //   }
  //   if (typeof userForm.y === "string"){
  //     pReq.y = userForm.y
  //   }
  //   if (typeof userForm.parameter === "string"){
  //     pReq.parameter = userForm.parameter
  //   }
  //   pReq.other_position = this.__other_position_parser(userForm.other_position)
    
  //   console.log(pReq)
    
  //   if (jobid!=null){
  //     this.jobService.getJobPreviewParEq(jobid,pReq).subscribe(data => {
  //       let tr_names:string[] = data["trace_name"];
  //       let x:number[][] = data["x"];
  //       let y:number[][] = data["y"];
  //       this.show_plot = true
  //       let traces = this.b2p.data1DTraces(tr_names, x, y)

  //       this.graph = {
  //         data: traces,
  //         layout: {width: 320, height: 240, title: 'A Fancy Plot'}
  //       };
  //       console.log(this.graph)
  //       });  
  //   }
  // }

  // previewContour(): void{
  //   console.log('press Contour button')
    
  //   const jobid = this.route.snapshot.paramMap.get('jobId');
  //   console.log(this.plotReqP2Form.value);
  //   let userForm = this.plotReqP2Form.value;
  //   let pReq: PlotContourRequest = {
  //     x:'',
  //     y:'',
  //     z:[],
  //     other_position:[]
  //   };
    
  //   if (typeof userForm.x === "string"){
  //     pReq.x = userForm.x
  //   }
  //   if (typeof userForm.y === "string"){
  //     pReq.y = userForm.y
  //   }
  //   if (typeof userForm.z === "string"){
  //     pReq.z = userForm.z.split(",")
  //   }
  //   pReq.other_position = this.__other_position_parser(userForm.other_position)
    
  //   console.log(pReq)
     
  // }
}
