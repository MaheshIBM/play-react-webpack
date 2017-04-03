import * as  React from 'react';
import {flatten,uniq} from 'lodash';
import container from "../inversify.config";
import BenchmarkService from "../services/benchmark_service";
import SERVICE_IDENTIFIER from "../constants/identifiers";

import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
   function formatLoads(workloads,row){
        return <span>{workloads.map((workload) => <div key={workload.name}> {workload.name}
            </div> )}</span>
        }
   function shortDate(date:string,row){
       
       return new Date(date).toISOString().slice(0, 10);
       }
       
export const Loader = () => <div className="loader">Loading...</div>

export class TPCDS extends React.Component<any,any>{
    
    
    
    constructor(props:any){
        super(props)
        
        this.state = {
            bm_data : [],
            load_names: [],
            loading: true
        };
    }
    
     getBenchMarks(){
        let bm_service = container.get<BenchmarkService>(SERVICE_IDENTIFIER.BM_SERVICE);
        return bm_service.getBenchmarks();
        }
    
    componentDidMount(){
        this.setState({loading: true}) 
        this.getBenchMarks().then(res=>{
            let all_wl = res.data.map(a => a.workloads.map(wl => wl.name))
            let load_names = uniq(flatten(all_wl))
            console.log(load_names)
            
            let mod_data  = res.data.map(row =>{ row.workloads.map(workload => workload.metrics.map(metric => { row[metric.name+workload.name] = metric.value}))
            return row
            });
            console.log("first data:")
            console.log(mod_data)
            this.setState({bm_data: mod_data});
            this.setState({load_names: load_names})
            this.setState({loading: false})
        });
    }
    
    render(){
        if(this.state.loading){
            return (<Loader/>)
        }
        console.log("Size is" + this.state.bm_data.length);
        return(
           <div>
                <BootstrapTable data={this.state.bm_data}  keyField='date' striped>
                    <TableHeaderColumn tdStyle={ { 'width': '150px' } } thStyle={ { 'width': '150px' } }  row='0' rowSpan='2' dataField='name'>Benchmark Name</TableHeaderColumn>
                    <TableHeaderColumn tdStyle={ { 'width': '150px' } } thStyle={ { 'width': '150px' } } row='0' rowSpan='2' dataField='date' dataFormat={shortDate} >Date</TableHeaderColumn>
                    <TableHeaderColumn tdStyle={ { 'width': '150px' } } thStyle={ { 'width': '150px' } } row='0' rowSpan='2' dataField='git_url' > repo url</TableHeaderColumn>

              {this.state.load_names.map(
                       function(name:string) { return [<TableHeaderColumn  row='0' colSpan='4' tdStyle={ { 'width': '400px' } } thStyle={ { 'width': '400px' } } >{name}</TableHeaderColumn>,
                            <TableHeaderColumn  tdStyle={ { 'width': '100px' } } thStyle={ { 'width': '100px' } }  dataField={"minTimeMs"+name} row='1'>min-time</TableHeaderColumn>,
                            <TableHeaderColumn tdStyle={ { 'width': '100px' } } thStyle={ { 'width': '100px' } } dataField={"maxTimeMs"+name} row='1'>max-time</TableHeaderColumn>,
                            <TableHeaderColumn tdStyle={ { 'width': '100px' } } thStyle={ { 'width': '100px' } } dataField={"avgTimeMs"+name} row='1'>avg-time</TableHeaderColumn>,
                            <TableHeaderColumn tdStyle={ { 'width': '100px' } } thStyle={ { 'width': '100px' } } dataField={"stdDev"+name} row='1'>std-dev</TableHeaderColumn> ]
                        })}
                </BootstrapTable>
          </div>
            );
    }
    
    
 
};

export default TPCDS;
