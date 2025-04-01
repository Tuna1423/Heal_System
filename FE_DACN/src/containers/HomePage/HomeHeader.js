import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { fetchSearchSpecialty } from '../../store/actions/adminActions';
import { adminMenu, doctorMenu } from '../Header/menuApp';
import _ from 'lodash';
import * as actions from "../../store/actions";
class HomeHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
        //fire redux event: actions
    }

    handleReturnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }

    handleViewAllClinic = () => {
        if (this.props.history) {
            this.props.history.push(`/all-clinic`)
        }
    }

    handleViewAllSpecialty = () => {
        if (this.props.history) {
            this.props.history.push(`/all-specialty`)
        }
    }

    handleViewSearchSpecialty = () => {
        if (this.props.history) {
            this.props.history.push(`/search-specialty`)
        }
    }

    handleViewAllDoctor = () => {
        if (this.props.history) {
            this.props.history.push(`/all-doctor`)
        }
    }

    handleViewAllHandbook = () => {
        if (this.props.history) {
            this.props.history.push(`/all-handbook`)
        }
    }

    handleOnKeyDown = async (event) => {
        if (event.key === 'Enter') {
            this.props.fetchSearchSpecialty(event.target.value)
            this.handleViewSearchSpecialty()
        }
    }

    render() {
        let { language, processLogout } = this.props

        return (
            <>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i class="fas fa-home" onClick={() => this.handleReturnToHome()}></i>
                            <div className='header-logo'
                                onClick={() => this.handleReturnToHome()}
                            ></div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content' onClick={() => this.handleViewAllSpecialty()}>
                                <div><b><FormattedMessage id="homeheader.speciality" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.search-doctor" /></div>
                            </div>
                            <div className='child-content' onClick={() => this.handleViewAllClinic()}>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-content' onClick={() => this.handleViewAllDoctor()}>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
                            <div className='child-content' onClick={() => this.handleViewAllHandbook()}>
                                <div><b><FormattedMessage id="homeheader.handbook" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.handbook-ques" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <a data-for='question' data-tip="React-tooltip" target="_blank" href="https://www.facebook.com/profile.php?id=61558772075824">
                                    <i className="fas fa-question-circle"></i><FormattedMessage id="homeheader.support" />
                                </a>
                                <ReactTooltip id='question' place="bottom" type="dark" effect="float">
                                    <p><FormattedMessage id="homeheader.help" /></p>
                                </ReactTooltip>
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-VI active' : 'language-VI'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}><strong>VN</strong></span></div>
                            <div className={language === LANGUAGES.EN ? 'language-EN active' : 'language-EN'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}><strong>EN</strong></span></div>
                            <div
                                className="btn btn-logout"
                                onClick={() => {
                                    this.props.processLogout(); 
                                    this.props.history.push('/login'); 
                                }}
                                title="Log out">
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                        </div>

                    </div>
                </div>
                {this.props.isShowBanner == true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="banner.title1" /></div>
                            <div className='title2'><FormattedMessage id="banner.title2" /></div>
                            <div className='search'>
                                <i className="fas fa-search"></i>
                                <input type='text' placeholder='Search ...' onKeyDown={(event) => this.handleOnKeyDown(event)} />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-hospital"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child1" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-mobile-alt"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child2" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-hospital-alt"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child3" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-vial"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child4" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-universal-access"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child5" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-user-md"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child6" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
        dataSpecialty: state.admin.dataSpecialty
        //inject
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        fetchSearchSpecialty: (nameInput) => dispatch(fetchSearchSpecialty(nameInput))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
