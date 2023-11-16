package o2.example.dairy.main.service;


import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service("mainService")
public class MainService {

	@Autowired
	@Resource(name="sqlSession")
	private SqlSessionTemplate sqlSession;

	public List<Map<String, Object>> getDiaryData(Map<String, Object> param) {
		return sqlSession.selectList("book.getDiaryData", param);
	}



}
