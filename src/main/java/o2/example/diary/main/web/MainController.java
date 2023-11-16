package o2.example.diary.main.web;


import o2.example.diary.main.service.MainService;
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
	@RequestMapping(produces = "application/json; charset=UTF-8" , value = "/getDiaryData" , method = RequestMethod.GET)
	@ResponseBody
	public String getDiaryData(HttpServletRequest request,  @RequestParam Map<String, Object> param ) {
		Map<String, Object> result = new HashMap<String, Object>();

		try {

			List<Map<String, Object>> rData = mainService.getDiaryData(param);

			result.put("SUCCESS", true);
			result.put("RESULT", rData);

		}catch (NullPointerException e) {
			LOGGER.error(e.getMessage());
			result.put("SUCCESS", false);
			result.put("MSG", e);
		}

		return ObjectMapperSupport.objectToJson(result);
	}

}
