var express = require('express');

var router = express.Router();
const axios = require('axios');


const apps = {
  devHydrameet:'https://pvc-api-dev.instrive.net/web/v1/',
  liveHydrameet:'https://vcapi.hydrameet.net/web/v1/',
  nicmeet:'https://api-nic.hydrameet.in/web/v1/',
  railmeet:'https://railmeet-vcapi.hydrameet.net/web/v1/'
}

/* GET home page. */
router.get('/recording/:env/:recording_id', async(req, res, next) => {
  if (!(req.params.env in apps))
  {
    res.send({error:`There is no such environment ${req.params.env}`})
  }
  if (req.params.recording_id =="" || req.params.recording_id ==" " )
  {
    res.send({error:`Recording lookup id should not be empty ${req.params.env}`})
  }

  await axios.get(`${apps[req.params.env]}meeting-recording-lookup/for-download/${req.params.recording_id}?tenantId=${req.query.tenantId}&meeting_access_token=${req.query.meeting_access_token}`).then((axiosResp)=>{
    if (!('url' in axiosResp.data))
    {
      res.send(axiosResp.data)
    }else
    {
      res.download('./recordings/'+axiosResp.data.directory_path+'/'+axiosResp.data.url);
    }
  }).catch(function (error) {
    if (error.response) {
      res.send(error.response.data)
    } else if (error.request) {
      res.send(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
        res.send(error.message)
    }

  });
  


});

module.exports = router;
