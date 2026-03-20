package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.model.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RuleRepo extends JpaRepository<Rule, Long> {
    List<Rule> findByRuleIdIn(List<Long> ids);
}
