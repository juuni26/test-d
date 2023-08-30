import React, { useReducer } from 'react';

import * as styles from './form.module.css'

const INITIAL_STATE = {
  "name": "",
  "email": "",
  "subject": "",
  "body": "",
  "status": "IDLE"
}


const reducer = (state, action) => {
  switch (action.type) {
    case "updateFieldValue":
      return {
        ...state,
        [action.field]: action.value
      }
    case "updateStatusValue":
      return {
        ...state,
        status: action.value
      }
    case "reset":
      return INITIAL_STATE
    default: throw Error('Unknown action: ' + action.type);
  }

}


const Form = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const handleInputChange = field => event => {
    dispatch({
      'type': 'updateFieldValue',
      field,
      'value': event.target.value
    })
  }

  const handleStatusChange = value => {
    dispatch({
      'type': 'updateStatusValue',
      'value': value
    })
  }

  const handleButtonReset = () => {
    dispatch({
      'type': 'reset'
    })
  }

  const handleButtonSubmit = (event) => {
    event.preventDefault();
    handleStatusChange('PENDING');

    fetch('/api/contact', {
      method: "POST",
      body: JSON.stringify(state)
    })
      .then(response => response.json())
      .then(response => {
        if (!response.boop) {
          console.log("boop")
          handleStatusChange("ERROR")

        } else {
          handleStatusChange("SUCCESS")
        }
      })
      .catch(err => {
        console.log("catch")
        handleStatusChange("ERROR")
      })

  };

  if (state.status === "SUCCESS") {
    return (
      <p className={styles.success}>
        Message Sent!
        <button className={`${styles.button} ${styles.centered}`} onClick={handleButtonReset}>Reset</button>
      </p>
    )
  }

  return (
    <>
      {state.status === "ERROR" && (<p className={styles.error}>Something went wrong. please try again.</p>)}
      <h2 style={{'text-align':'center','fontSize':"1rem"}}>Send email with mailgun dadadadar</h2>
      <form className={`${styles.form} ${state.status === "PENDING" && styles.pending}`} onSubmit={handleButtonSubmit}>
        <label className={styles.label}>
          Name
          <input className={styles.input} type='text' name='name' onChange={handleInputChange("name")} value={state.name} />
        </label>
        <label className={styles.label}>
          Email
          <input className={styles.input} type='email' name='email' onChange={handleInputChange("email")} value={state.email} />
        </label>
        <label className={styles.label}>
          Subject
          <input className={styles.input} type='text' name='subject' onChange={handleInputChange("subject")} value={state.subject} />
        </label>
        <label className={styles.label}>
          Body
          <textarea className={styles.input} type='text' name='body' onChange={handleInputChange("body")} value={state.body} />
        </label>
        <button className={styles.button}>Send</button>
      </form>
    </>
  )
}

export default Form;