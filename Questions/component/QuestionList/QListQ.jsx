import React from 'react';
import axios from 'axios';
import QListA from './AnswerList/QListA.jsx';
import HelpfulQ from './SideBar/HelpfulQ.jsx';
import AAdd from './SideBar/AAdd/AAdd.jsx';
import MoreA from './MoreA/MoreA.jsx';
import styles from './QListQ.module.css';

class QListQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      twoAnswers: [],
      allAnswers: [],
      aTotal: 0,
      expand: false
    }

    this.getAnswers = this.getAnswers.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.updateHelpfulA = this.updateHelpfulA.bind(this);
    this.reportA = this.reportA.bind(this);
    this.moreA = this.moreA.bind(this);
  }

  componentDidMount() {
    this.getAnswers(this.props.question.question_id);
  }

  getAnswers(questionID) {
    console.log('test')
    axios.get(`/qa/questions/${questionID}/answers?page=1&count=100`)
      .then(answers => {
        let twoAnswers = answers.data.slice(0, 2);

        this.setState({
          twoAnswers: twoAnswers,
          answers: twoAnswers,
          allAnswers: answers.data,
          aTotal: answers.data.length
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  addAnswer(questionID, answerForm) {
    axios.post(`/qa/questions/${questionID}/answers`, answerForm)
      .then(() => {
        this.getAnswers(questionID);
      })
      .catch(err => {
        console.log(err);
      })
  }

  updateHelpfulA(questionID, answerID) {
    axios.put(`/qa/answers/${answerID}/helpful`, { answer_helpfulness: 1 })
      .then(() => {
        this.getAnswers(questionID);
      })
      .catch(err => {
        console.log(err);
      })
  }

  reportA(questionID, answerID) {
    axios.put(`/qa/answers/${answerID}/report`, { reported: true })
      .then(() => {
        this.getAnswers(questionID);
      })
      .catch(err => {
        console.log(err);
      })
  }

  moreA(expand) {
    this.setState({
      expand: expand
    }, () => {
      if (expand) {
        this.setState({
          answers: this.state.allAnswers
        })
      } else {
        this.setState({
          answers: this.state.twoAnswers
        })
      }
    })
  }

  render() {
    const {
      question: {
        question_body,
        question_helpfulness,
        question_id,
        answers
      }
    } = this.props;

    return(
      <section className={styles.questionContainer}>
        <div className={styles["question-body"]}>
          <div className={styles["question-left"]}>
            <span className={styles["question-prefix"]}>
              Q:
            </span>
            <span className={styles["question-text"]}>
              {question_body}
            </span>
          </div>

          <div className={styles["question-right"]}>
            <div className={styles["question-sidebar"]}>
              <HelpfulQ
                helpful={question_helpfulness}
                questionID={question_id}
                updateHelpfulQ={this.props.updateHelpfulQ}
              />

              <span className="separator">|</span>

              <AAdd
                addAnswer={this.addAnswer}
                questionID={question_id}
                questionBody={question_body}
                productName={this.props.productName}
              />
            </div>
          </div>
        </div>

        <section className={styles.answersContainer}>
          {this.state.answers.map(answer =>
            <QListA
              key={answer.answer_id}
              questionID={question_id}
              answer={answer}
              updateHelpfulA={this.updateHelpfulA}
              reportA={this.reportA}
              getAnswers={this.getAnswers}
            />
          )}

          {this.state.aTotal > 2 ? <MoreA  moreA={this.moreA} /> : null}
        </section>
      </section>
    )
  }
}

export default QListQ;