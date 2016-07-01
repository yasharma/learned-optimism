import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager, PageItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';
import lowerCaseFirstLetter from './lowerCaseFirstLetter';

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      alternativeDescription: ''
    };
  },
  componentWillMount() {
    this.bindAsArray(this.props.beliefRef.child('alternatives'), 'alternatives');
  },
  render() {
    const belief = this.props.belief;
    const alternatives = this.state.alternatives;

    return(belief ?
      <div>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>
            What alternatives are there to&nbsp;
            {lowerCaseFirstLetter(belief.description)}?
          </ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl type='text' 
                           placeholder='Alternative' 
                           value={this.state.alternativeDescription}
                           onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button type="submit" disabled={this.state.isSaving}>
                  Add
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        {alternatives && 
          <div className="list-group">
            {alternatives.map(alternative => {
              return (
                <div className="list-group-item" key={alternative['.key']}>
                  {alternative.description}
                </div>
              );
            })}
          </div>
        }
        <Pager>
          <PageItem previous onClick={this.handleBack}>
            &larr; Evidence
          </PageItem>
          <PageItem next onClick={this.handleNext}>
            Implications &rarr;
          </PageItem>
        </Pager>
      </div>
      :
      <div/>
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({alternativeDescription: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({isSaving: true});

    this.firebaseRefs.alternatives.push({
      description: this.state.alternativeDescription
    }).then(() => {
      this.setState({alternativeDescription: '', isSaving: false});
    });
  },
  handleBack(e) {
    e.preventDefault();
    this.props.router.push(`/beliefs/${this.props.beliefRef.key}/evidence`);
  },
  handleNext(e) {
    e.preventDefault();
    this.props.router.push(`/beliefs/${this.props.beliefRef.key}/implications`);
  }
}));