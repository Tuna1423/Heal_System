import React, { Component } from 'react';
import { connect } from "react-redux";
import './ProfileDoctor.scss'
import { LANGUAGES } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import {getProfileDoctorByIdService} from '../../../services/userService'
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import localization from 'moment/locale/vi'
import { Link } from 'react-router-dom';

class ProfileDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataProfile: {},

        }
    }

    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }

    getInfoDoctor = async(id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctorByIdService(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

        if (this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getInfoDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data,
            });
        }
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props
        
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI
                ? dataTime.timeTypeData.valueVi
                : dataTime.timeTypeData.valueEn
            
            let date = language === LANGUAGES.VI
                ? moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return (
                <>
                    <div>{ time } - { date }</div>
                    <div><FormattedMessage id="patient.booking-modal.price-booking"/></div>
                </>
            )
        }
        return <></>
    }

    render() {
        let { dataProfile } = this.state
        let { language, isShowDescDoctor, dataTime, isShowLinkDetail, isShowPrice, doctorId } = this.props
        let nameVi = '', nameEn = ''
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='bg-img content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})`}}
                    >

                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            { isShowDescDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description
                                        && <span>{ dataProfile.Markdown.description}</span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div> 
                    </div>  
                </div>
                { isShowLinkDetail === true && 
                    <div className='text-info-center'>
                        <Link to={`/detail-doctor/${doctorId}`}><FormattedMessage id="homepage.more-info"/></Link>
                    </div>
                }
                { isShowPrice === true && 
                    <div className='price'>
                        <FormattedMessage id="patient.booking-modal.price"/>
                        {dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.VI ? 
                            <NumberFormat
                                className='currency'
                                value={ dataProfile.Doctor_Info.priceTypeData.valueVi }
                                displayType='text'
                                thousandSeparator={true}
                                suffix='VNĐ'
                            /> : ''
                        }
                            {dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.EN ? 
                                <NumberFormat
                                className='currency'
                                value={ dataProfile.Doctor_Info.priceTypeData.valueEn }
                                displayType='text'
                                thousandSeparator={true}
                                suffix='USD'
                                /> : ''
                            }
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {    
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
