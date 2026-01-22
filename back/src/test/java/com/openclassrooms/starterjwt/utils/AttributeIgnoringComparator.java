package com.openclassrooms.starterjwt.utils;

import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;
import org.skyscreamer.jsonassert.Customization;
import org.skyscreamer.jsonassert.JSONCompareMode;
import org.skyscreamer.jsonassert.JSONCompareResult;
import org.skyscreamer.jsonassert.comparator.CustomComparator;
import org.springframework.test.json.JsonAssert;
import org.springframework.test.json.JsonComparator;

import static org.skyscreamer.jsonassert.comparator.JSONCompareUtil.*;

public class AttributeIgnoringComparator extends CustomComparator {
	private final Set<String> attributesToIgnore;

	public AttributeIgnoringComparator(String... attributesToIgnore) {
		super(JSONCompareMode.LENIENT, new Customization[] {});
		this.attributesToIgnore = Set.of(attributesToIgnore);
	}

	public static JsonComparator ignoreAttrs(String... attributesToIgnore) {
		return JsonAssert.comparator(new AttributeIgnoringComparator(attributesToIgnore));
	}

	protected void checkJsonObjectKeysExpectedInActual(String prefix, JSONObject expected, JSONObject actual,
			JSONCompareResult result) throws JSONException {
		Set<String> expectedKeys = getKeys(expected);
		expectedKeys.removeAll(attributesToIgnore);
		for (String key : expectedKeys) {
			Object expectedValue = expected.get(key);
			if (actual.has(key)) {
				Object actualValue = actual.get(key);
				compareValues(qualify(prefix, key), expectedValue, actualValue, result);
			} else {
				result.missing(prefix, key);
			}
		}
	}

}
