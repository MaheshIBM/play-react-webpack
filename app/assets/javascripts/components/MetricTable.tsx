import * as  React from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'bootstrap/dist/css/bootstrap.css';


export class MetricTable extends React.Component<any,any>{
	constructor(props:any){
        super(props) 	
    }
	
   render(){
	  return (
		<div>
		<BootstrapTable data={this.props.data} keyField='Date' striped hover options={ { noDataText: 'No coordinates selected' } } >
		{
			
			this.props.metric_names.map((names,index) => {
				return(<TableHeaderColumn key={index} dataField={names}>{names}</TableHeaderColumn>)
			})	
		}
		 
		</BootstrapTable>
		</div>
	  );
  }
}

