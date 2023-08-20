package o2.example.o2calendar.main.web;


import o2.example.o2calendar.main.service.MainService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import util.ObjectMapperSupport;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "")
public class MainController {
	private static final Logger LOGGER = LoggerFactory.getLogger(MainController.class);
	@Resource(name = "mainService")
	private MainService mainService;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home() {
		System.out.println("home controller start");

		return "index";
	}

	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String admin() {
		System.out.println("admin controller start");

		return "admin";
	}

	@RequestMapping(produces = "application/json; charset=UTF-8" , value = "/getBemingData" , method = RequestMethod.GET)
	@ResponseBody
	public String getBemingData(HttpServletRequest request,  @RequestParam Map<String, Object> param ) {
		Map<String, Object> result = new HashMap<String, Object>();

		try {

			List<Map<String, Object>> rData = mainService.getBemingData(param);

			result.put("SUCCESS", true);
			result.put("RESULT", rData);

		}catch (NullPointerException e) {
			LOGGER.error(e.getMessage());
			result.put("SUCCESS", false);
			result.put("MSG", e);
		}

		return ObjectMapperSupport.objectToJson(result);
	}

	@RequestMapping(produces = "application/json; charset=UTF-8" , value = "/getBookingMemberList" , method = RequestMethod.GET)
	@ResponseBody
	public String getBookingMemberList(HttpServletRequest request,  @RequestParam Map<String, Object> param ) {
		Map<String, Object> result = new HashMap<String, Object>();

		try {

			List<Map<String, Object>> rData = mainService.getBookingMemberList(param);

			result.put("SUCCESS", true);
			result.put("RESULT", rData);

		}catch (NullPointerException e) {
			LOGGER.error(e.getMessage());
			result.put("SUCCESS", false);
			result.put("MSG", e);
		}

		return ObjectMapperSupport.objectToJson(result);
	}



	@RequestMapping(produces = "application/json; charset=UTF-8" , value = "/insertBookingData" , method = RequestMethod.POST)
	@ResponseBody
	public String insertBookingData(HttpServletRequest request,  @RequestParam Map<String, Object> param ) {
		Map<String, Object> result = new HashMap<String, Object>();

		try {

			List<Map<String, Object>> rData = mainService.insertBookingData(param);
			mainService.updateBookCount(param);

			result.put("SUCCESS", true);
			result.put("RESULT", rData);

		}catch (NullPointerException e) {
			LOGGER.error(e.getMessage());
			result.put("SUCCESS", false);
			result.put("MSG", e);
		}

		return ObjectMapperSupport.objectToJson(result);
	}

	@RequestMapping(produces = "application/json; charset=UTF-8" , value = "/updatePayData" , method = RequestMethod.POST)
	@ResponseBody
	public String updatePayData(HttpServletRequest request,  @RequestParam Map<String, Object> param ) {
		Map<String, Object> result = new HashMap<String, Object>();

		try {

			System.out.println("param : " + param);
			String[] payData = param.get("payData").toString().split(",");
			String[] payYn = param.get("payYn").toString().split(",");
			for(int i=0; i<payData.length; i++){
				payData[i] = payData[i].replace("[", "").replace("]", "").replace("\"", "");
				payYn[i] = payYn[i].replace("[", "").replace("]", "").replace("\"", "");
				Map<String, Object> params = new HashMap<String, Object>();
				params.put("payData", payData[i]);
				params.put("payYn", payYn[i]);
				mainService.updatePayData(params);

			}
			//mainService.updatePayData(param);
			result.put("SUCCESS", true);

		}catch (NullPointerException e) {
			LOGGER.error(e.getMessage());
			result.put("SUCCESS", false);
			result.put("MSG", e);
		}

		return ObjectMapperSupport.objectToJson(result);
	}

	@RequestMapping(produces = "application/json; charset=UTF-8" , value = "/deleteData" , method = RequestMethod.POST)
	@ResponseBody
	public String deleteData(HttpServletRequest request,  @RequestParam Map<String, Object> param ) {
		Map<String, Object> result = new HashMap<String, Object>();

		try {

			System.out.println("param : " + param);
			String[] deleteData = null;
			if (param.get("deleteData") == "[]" || param.get("deleteData") == null){
				return ObjectMapperSupport.objectToJson(result);
			}else{
				deleteData = param.get("deleteData").toString().split(",");
			}
			for(int i=0; i<deleteData.length; i++){
				deleteData[i] = deleteData[i].replace("[", "").replace("]", "").replace("\"", "");

				Map<String, Object> params = new HashMap<String, Object>();
				params.put("deleteData", deleteData[i]);
				mainService.deleteData(params);
				mainService.minusBookCount(param);
			}

			result.put("SUCCESS", true);

		}catch (NullPointerException e) {
			LOGGER.error(e.getMessage());
			result.put("SUCCESS", false);
			result.put("MSG", e);
		}

		return ObjectMapperSupport.objectToJson(result);
	}

}
