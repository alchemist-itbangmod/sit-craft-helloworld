import React from 'react'

export const HelloWorld = ({ text }) => (
  <div>{ text }</div>
)

class HelloWorldContainer extends React.Component {
  render() {
    return <HelloWorld text="sit-craft-camp ! - demo" />
  }
}

export default HelloWorldContainer
