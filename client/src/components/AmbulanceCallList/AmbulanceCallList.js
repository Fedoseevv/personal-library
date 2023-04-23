import {AmbulanceCallItem} from "../AmbulanceCallItem/AmbulanceCallItem";

import './AmbulanceCallList.css';

export const AmbulanceCallList = ({calls, onConfirmHandler, onCancelHandler}) => {
    return (
      <div className={"ambulanceCalls__container"}>
          {
              calls.map(item => {
                  return <AmbulanceCallItem data={item}
                                            onConfirmHandler={onConfirmHandler}
                                            onCancelHandler={onCancelHandler} />
              })
          }
      </div>
    );
}