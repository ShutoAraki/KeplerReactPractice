import React from 'react';

// class DropdownButton extends React.Component {
//     constructor() {
//         super()
//         this.state = {
//             data_files: [
//                 {
//                     id: 0,
//                     title: 'TokyoArea-node-kanagawa',
//                     selected: false,
//                     key: 'nodeData'
//                 },
//                 {
//                     id: 1,
//                     title: 'TokyoArea-node-tokyo',
//                     selected: false,
//                     key: 'nodeData'
//                 },
//                 {
//                     id: 2,
//                     title: 'TokyoArea-link-tokyo',
//                     selected: false,
//                     key: 'linkData'
//                 }
//             ]
//         }
//     }
  
//     handleClickOutside(){
//         this.setState({
//             listOpen: false
//         })
//     }

//     toggleList(){
//         this.setState(prevState => ({
//             listOpen: !prevState.listOpen
//         }))
//     }

//     render(){
//         const{list} = this.props
//         const{listOpen, headerTitle} = this.state
//         return(
//             <div className="dd-wrapper">
//             <button className="dd-header" onClick={() => this.toggleList()}>
//                 <div className="dd-header-title">{headerTitle}</div>
//             </button>
//             {listOpen && <ul className="dd-list">
//                 {list.map((item) => (
//                 <li className="dd-list-item" key={item.id} >{item.title}</li>
//                 ))}
//             </ul>}
//             </div>
//         )
//     }
// }

const dropdownStyle = {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    right: 200,
    width: '120px',
    height: '40px',
    backgroundColor: '#1f7cf4',
    color: '#FFFFFF',
    cursor: 'pointer',
    border: 0,
    borderRadius: '3px',
    fontSize: '12px',
    margin:'30px',
};

const scrollableMenu = {
    height: 'auto',
    maxHeight: '200px',
    overflowX: 'hidden'
};

const DropdownButton = ({title, data_files, getData}) => {
    return(
        <div className="dropdown">
            <button style={dropdownStyle} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {title}
            </button>
            <div style={scrollableMenu} className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {data_files.map(data_file => (
                <button className="dropdown-item" type="button" onClick={() => getData(data_file)} key={data_file.id}>{data_file.name}</button>
            ))}
            </div>
        </div>
    )
};

export default DropdownButton;