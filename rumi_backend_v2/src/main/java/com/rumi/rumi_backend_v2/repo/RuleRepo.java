package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RuleRepo extends JpaRepository<Rule, Long> {
    List<Rule> findByRuleIdIn(List<Long> ids);
}
